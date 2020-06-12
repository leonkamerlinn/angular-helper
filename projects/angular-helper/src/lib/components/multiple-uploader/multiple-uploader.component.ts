import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'lib-multiple-uploader',
    templateUrl: './multiple-uploader.component.html',
    styleUrls: ['./multiple-uploader.component.scss']
})
export class MultipleUploaderComponent implements OnInit {

    ngOnInit(): void {
    }
    isHovering: boolean;

    files: File[] = [];

    toggleHover(event: boolean) {
        this.isHovering = event;
    }

    onDrop(files: FileList) {
        for (let i = 0; i < files.length; i++) {
            this.files.push(files.item(i));
        }
    }



}
