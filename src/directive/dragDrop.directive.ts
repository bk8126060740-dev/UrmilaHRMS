import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AppConstant } from "../common/app-constant";

export interface FileHandle {
  file?: File,
  url: SafeUrl,
  name: string
}

@Directive({
  selector: "[appDrag]"
})
export class DragDirective {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();
  @Output() fileSizeError: EventEmitter<string[]> = new EventEmitter();

  @HostBinding("style.background") private background = "#fff";

  private readonly maxFileSize = 15 * 1024 * 1024; 

  constructor(private sanitizer: DomSanitizer) { }

  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#fff";
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#fff";
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#fff';

    const dataTransfer = evt.dataTransfer;
    if (!dataTransfer) {
      return;
    }

    let files: FileHandle[] = [];
    let errorMessages: string[] = [];

    for (let i = 0; i < dataTransfer.files.length; i++) {
      const file = dataTransfer.files[i];
      if (file.size > AppConstant.FILE30MB) {
        errorMessages.push(`File "${file.name}" exceeds the size limit of 5MB.`);
        continue;
      }
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      const name = file.name;
      files.push({ file, url, name });
    }

    if (files.length > 0) {
      this.files.emit(files);
    }

    if (errorMessages.length > 0) {
      this.fileSizeError.emit(errorMessages);
    }
  }
}
