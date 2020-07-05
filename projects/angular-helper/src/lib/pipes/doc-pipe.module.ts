import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocPipe } from './doc.pipe';
import { FirestoreUrlPipe } from './firestore-url.pipe';
import { FileSizePipe } from './file-size.pipe';


@NgModule({
    declarations: [DocPipe, FirestoreUrlPipe, FileSizePipe],
    imports: [
        CommonModule
    ],
    exports: [DocPipe, FirestoreUrlPipe]
})
export class DocPipeModule {
}
