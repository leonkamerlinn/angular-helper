import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadTaskComponent } from "./upload-task.component";
import { DocPipeModule } from "../../pipes/doc-pipe.module";


@NgModule({
    declarations: [UploadTaskComponent],
    imports: [
        CommonModule,
        DocPipeModule
    ],
    exports: [UploadTaskComponent]
})
export class UploadTaskModule {
}
