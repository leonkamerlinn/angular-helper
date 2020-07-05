import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { from, Observable, of } from "rxjs";

@Pipe({
    name: 'firestoreUrl'
})
export class FirestoreUrlPipe implements PipeTransform {

    constructor(private storage: AngularFireStorage) {
    }

    transform(path: string, ...args: any[]): Observable<string> {
        if (path.startsWith('http')) {
            return of(path)
        }
        const ref = this.storage.ref(path);
        return from(ref.getDownloadURL().toPromise());
    }

}
