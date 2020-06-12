import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropzoneDirective } from './dropzone.directive';


@NgModule({
    declarations: [DropzoneDirective],
    imports: [
        CommonModule
    ],
    exports: [DropzoneDirective]
})
export class DropzoneModule {
}
