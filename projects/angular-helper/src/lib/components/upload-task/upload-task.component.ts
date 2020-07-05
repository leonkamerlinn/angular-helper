import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize, tap } from "rxjs/operators";
import { AngularFireStorage, AngularFireUploadTask } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import * as uuid from 'uuid';
import { UploadTaskSnapshot } from "@angular/fire/storage/interfaces";

export type ImgResult = {
    width: number;
    height: number;
    src: string | ArrayBuffer | null
};

@Component({
    selector: 'lib-upload-task',
    templateUrl: './upload-task.component.html',
    styleUrls: ['./upload-task.component.css']
})
export class UploadTaskComponent implements OnInit {

    @Input() file: File;
    @Input() directory: string;
    @Input() allowedFileTypes: string = 'image/*';
    @Input() allowedImageRation: number[];
    @Input() maxSize: number = 1024 * 1024 * 1024 * 10;
    @Input() minSize: number = 100;
    @Output() completed: EventEmitter<void> = new EventEmitter<void>()

    task: AngularFireUploadTask;
    snapshot: Observable<UploadTaskSnapshot>;
    imgResult: ImgResult
    path: string;


    constructor(private storage: AngularFireStorage, private db: AngularFirestore) {
    }

    async ngOnInit() {
        if (this.file.size > this.maxSize || this.file.size < this.minSize) return;
        if (!this.file.type.match(this.allowedFileTypes)) return;
        await this.startUpload();
    }

    async startUpload() {

        if (this.isImage()) {
            try {
                this.imgResult = await this.imageResult()
            } catch (e) {

            }
        }

        const uid = uuid.v4();
        // The storage path
        this.path = `${this.directory}/${uid}`;

        // The main task
        this.task = this.storage.upload(this.path, this.file);

        // Progress monitoring
        this.task.percentageChanges();

        this.snapshot = this.task.snapshotChanges().pipe(
            finalize(async () => {
                this.completed.emit();
            }),
        );
    }

    isActive(snapshot) {
        return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
    }

    isImage(): boolean {
        return this.file.type.startsWith('image')
    }

    imageResult(): Promise<ImgResult> {
        return new Promise<ImgResult>((resolve, reject) => {
            const fr = new FileReader;

            fr.onload = () => { // file is loaded
                const img = new Image();

                img.onload = () => {
                    alert(img.width); // image is loaded; sizes are available
                    resolve({
                        width: img.width,
                        height: img.height,
                        src: fr.result
                    });
                };

                img.onerror = (err) => {
                    reject(err);
                }
            };

            fr.readAsDataURL(this.file);
        })
    }

}
