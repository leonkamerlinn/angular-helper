import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { map, tap, take, switchMap, mergeMap, expand, takeWhile } from 'rxjs/operators';

import * as firebase from 'firebase/app';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    Action,
    DocumentSnapshotDoesNotExist, DocumentSnapshotExists, DocumentChangeAction
} from "@angular/fire/firestore";
import { DocumentReference } from "@angular/fire/firestore/interfaces";
import FieldValue = firebase.firestore.FieldValue;

export type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
export type DocPredicate<T> = string | AngularFirestoreDocument<T>;
export type WithId<T> = T & {
    id: string,
    updatedAt?: FieldValue,
    createdAt?: FieldValue,
};


@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    constructor(private afs: AngularFirestore) {
    }

    /// **************
    /// Get a Reference
    /// **************

    col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
        return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
    }

    doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
        return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
    }

    /// **************
    /// Get Data
    /// **************

    doc$<T>(ref: DocPredicate<T>): Observable<WithId<T>> {
        return this.doc(ref)
            .snapshotChanges()
            .pipe(
                map((doc: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
                    const obj = doc.payload.data() as T;
                    return {
                        ...obj,
                        id: doc.payload.id
                    }
                }),
            );
    }

    col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
        return this.col(ref, queryFn)
            .snapshotChanges()
            .pipe(
                map((docs: DocumentChangeAction<T>[]) => {
                    return docs.map((a: DocumentChangeAction<T>) => a.payload.doc.data()) as T[];
                }),
            );
    }

    /// with Ids
    colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<WithId<T>[]> {
        return this.col(ref, queryFn)
            .snapshotChanges()
            .pipe(
                map((actions: DocumentChangeAction<T>[]) => {
                    return actions.map((a: DocumentChangeAction<T>) => {
                        const data: T = a.payload.doc.data() as T;
                        const id: string = a.payload.doc.id;
                        const obj: WithId<T> = { id, ...data };
                        return obj;
                    });
                }),
            );
    }

    /// **************
    /// Write Data
    /// **************

    /// Firebase Server Timestamp
    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    set$<T>(ref: DocPredicate<T>, data: T & { id: string | number }, merge: boolean = true): Observable<T & { id: string | number }> {
        return from(new Promise<T & { id: string | number }>(async (resolve, reject) => {
            const timestamp = this.timestamp;
            try {
                await this.doc(ref).set({
                    ...data,
                    updatedAt: timestamp,
                    createdAt: timestamp,
                }, { merge });

                resolve(data);


            } catch (e) {
                reject(e);
            }
        }));


    }

    set<T>(ref: DocPredicate<T>, data: any): Promise<void> {
        const timestamp = this.timestamp;
        return this.doc(ref).set({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
        });
    }

    update<T>(ref: DocPredicate<T>, data: any): Promise<void> {
        return this.doc(ref).update({
            ...data,
            updatedAt: this.timestamp,
        });
    }

    delete$<T>(ref: DocPredicate<T>): Observable<string> {
        return from(new Promise<string>(async (resolve, reject) => {
            try {
                await this.delete(ref);
                return resolve('DELETED')
            } catch (e) {
                return reject(e);
            }
        }));

    }

    delete<T>(ref: DocPredicate<T>): Promise<void> {
        return this.doc(ref).delete();
    }


    async add<T>(ref: CollectionPredicate<T>, data): Promise<WithId<T>> {
        const timestamp = this.timestamp;
        const createdDocument: DocumentReference = await this.col(ref).add({
            ...data,
            updatedAt: timestamp,
            createdAt: timestamp,
        });

        return this.doc$<T>(createdDocument.path).toPromise()
    }

    add$<T>(ref: CollectionPredicate<T>, data): Observable<WithId<T>> {
        return from(this.add(ref, data));
    }

    geopoint(lat: number, lng: number): firebase.firestore.GeoPoint {
        return new firebase.firestore.GeoPoint(lat, lng);
    }

    /// If doc exists update, otherwise set
    upsert<T>(ref: DocPredicate<T>, data: any): Promise<void> {
        const doc = this.doc(ref)
            .snapshotChanges()
            .pipe(take(1))
            .toPromise();

        return doc.then((snap: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
            return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
        });
    }

    /// **************
    /// Inspect Data
    /// **************

    inspectDoc(ref: DocPredicate<any>): void {
        const tick = new Date().getTime();
        this.doc(ref)
            .snapshotChanges()
            .pipe(
                take(1),
                tap((d: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<any>>) => {
                    const tock = new Date().getTime() - tick;
                    console.log(`Loaded Document in ${tock}ms`, d);
                }),
            )
            .subscribe();
    }

    inspectCol(ref: CollectionPredicate<any>): void {
        const tick = new Date().getTime();
        this.col(ref)
            .snapshotChanges()
            .pipe(
                take(1),
                tap((c: DocumentChangeAction<any>[]) => {
                    const tock = new Date().getTime() - tick;
                    console.log(`Loaded Collection in ${tock}ms`, c);
                }),
            )
            .subscribe();
    }

    /// **************
    /// Create and read doc references
    /// **************

    /// create a reference between two documents
    connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) {
        return this.doc(host).update({ [key]: this.doc(doc).ref });
    }

    /// returns a documents references mapped to AngularFirestoreDocument
    docWithRefs$<T>(ref: DocPredicate<T>) {
        return this.doc$(ref).pipe(
            map((doc: T) => {
                for (const k of Object.keys(doc)) {
                    if (doc[k] instanceof firebase.firestore.DocumentReference) {
                        doc[k] = this.doc(doc[k].path);
                    }
                }
                return doc;
            }),
        );
    }

    /// **************
    /// Atomic batch example
    /// **************

    /// Just an example, you will need to customize this method.
    atomic() {
        const batch = firebase.firestore().batch();
        /// add your operations here

        const itemDoc = firebase.firestore().doc('items/myCoolItem');
        const userDoc = firebase.firestore().doc('users/userId');

        const currentTime = this.timestamp;

        batch.update(itemDoc, { timestamp: currentTime });
        batch.update(userDoc, { timestamp: currentTime });

        /// commit operations
        return batch.commit();
    }

    /**
     * Delete a collection, in batches of batchSize. Note that this does
     * not recursively delete subcollections of documents in the collection
     * from: https://github.com/AngularFirebase/80-delete-firestore-collections/blob/master/src/app/firestore.service.ts
     */
    deleteCollection(path: string, batchSize: number): Observable<any> {
        const source = this.deleteBatch(path, batchSize);

        // expand will call deleteBatch recursively until the collection is deleted
        return source.pipe(
            expand(val => this.deleteBatch(path, batchSize)),
            takeWhile(val => val > 0),
        );
    }

    // Detetes documents as batched transaction
    private deleteBatch(path: string, batchSize: number): Observable<any> {
        const colRef = this.afs.collection(path, ref => ref.orderBy('__name__').limit(batchSize));

        return colRef.snapshotChanges().pipe(
            take(1),
            mergeMap((snapshot: DocumentChangeAction<{}>[]) => {
                // Delete documents in a batch
                const batch = this.afs.firestore.batch();
                snapshot.forEach(doc => {
                    batch.delete(doc.payload.doc.ref);
                });

                return from(batch.commit()).pipe(map(() => snapshot.length));
            }),
        );
    }
}
