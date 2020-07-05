import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lib-single-uploader',
    templateUrl: './single-uploader.component.html',
    styleUrls: ['./single-uploader.component.scss']
})
export class SingleUploaderComponent implements OnInit {

    ngOnInit() {
    }
    isHovering: boolean;

    file: File = null

    toggleHover(event: boolean) {
        this.isHovering = event;
    }

    onDrop(files: FileList) {
        if (this.file === null && files.length > 0) {
            this.file = files.item(0)
        }
    }

}
