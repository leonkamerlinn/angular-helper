import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleUploaderComponent } from "./single-uploader.component";


@NgModule({
    declarations: [SingleUploaderComponent],
    imports: [
        CommonModule
    ],
    exports: [SingleUploaderComponent]
})
export class SingleUploaderModule {
}
