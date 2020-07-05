import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleUploaderComponent } from "./single-uploader.component";
import { UploadTaskModule } from "../upload-task/upload-task.module";
import { DropzoneModule } from "../../directives/dropzone/dropzone.module";


@NgModule({
    declarations: [SingleUploaderComponent],
    imports: [
        CommonModule,
        UploadTaskModule,
        DropzoneModule
    ],
    exports: [SingleUploaderComponent]
})
export class SingleUploaderModule {
}
