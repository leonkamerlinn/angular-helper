import { Pipe, PipeTransform } from '@angular/core';
import { FirestoreService } from "../services/firestore-service.service";
import { Observable } from "rxjs";
import { DocumentReference } from "@angular/fire/firestore";

@Pipe({
    name: 'doc'
})
export class DocPipe implements PipeTransform {

    constructor(private db: FirestoreService) {
    }

    transform(value: DocumentReference): Observable<any> {
        return this.db.doc$(value.path);
    }

}
