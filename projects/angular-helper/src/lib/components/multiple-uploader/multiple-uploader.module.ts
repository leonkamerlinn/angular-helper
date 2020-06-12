import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipleUploaderComponent } from "./multiple-uploader.component";
import { UploadTaskModule } from "../upload-task/upload-task.module";
import { DropzoneModule } from "../../directives/dropzone/dropzone.module";


@NgModule({
    declarations: [MultipleUploaderComponent],
    imports: [
        CommonModule,
        UploadTaskModule,
        DropzoneModule
    ],
    exports: [MultipleUploaderComponent]
})
export class MultipleUploaderModule {
}
