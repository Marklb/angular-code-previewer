import { Component, OnInit, OnDestroy, AfterViewChecked, Input,
  ViewChild, ElementRef } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import * as hljs from 'highlight.js'

declare const document: any

@Component({
  selector: 'code-previewer',
  templateUrl: './code-previewer.component.html',
  styleUrls: ['./code-previewer.component.scss']
})
export class CodePreviewerComponent implements OnInit, OnDestroy, AfterViewChecked {

  private _filename: string
  private _highlightedElement: any
  private _prevTextContent: string

  @Input('textContent') textContent: string = ''

  @Input('options') options: any
  @Input('lang') lang: string

  @Input('filename')
  set filename(val: string) {
    this._filename = val
    this.updateFileContent()
  }
  get filename() {
    return this._filename
  }

  @ViewChild('codeContainer') codeContainer: ElementRef
  @ViewChild('codeTextArea') codeTextArea: ElementRef

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.updatePrevTextContent()
  }

  ngOnDestroy() {
    this.tryDeleteCodeBlock()
  }

  ngAfterViewChecked() {
    if (this.isTextDifferent()) {
      this.updatePrevTextContent()
      this.createCodeBlock()
    }
  }

  public isTextDifferent(): boolean {
    return this._prevTextContent !== this.codeTextArea.nativeElement.innerHTML
  }

  public updatePrevTextContent(): void {
    this._prevTextContent = this.codeTextArea.nativeElement.innerHTML
  }

  public async updateFileContent(): Promise<void> {
    this.textContent = await this.http.get(this._filename,
      { responseType: 'text' }).toPromise()
  }

  public tryDeleteCodeBlock(): boolean {
    if (this._highlightedElement) {
      this.codeContainer.nativeElement.removeChild(this._highlightedElement)
      this._highlightedElement = null
      return true
    }
    return false
  }

  public getTextAreaText(): string {
    return this.codeTextArea.nativeElement.innerHTML
  }

  public createCodeBlock(): void {
    this.tryDeleteCodeBlock()

    this._highlightedElement = document.createElement('pre')
    if (this.lang) {
      this._highlightedElement.classList.add(this.lang)
    }

    const text = this.getTextAreaText()
    this._highlightedElement.innerHTML = '' + text.trim()
    this.codeContainer.nativeElement.appendChild(this._highlightedElement)

    hljs.configure(Object.assign({}, this.options))
    hljs.highlightBlock(this._highlightedElement)
  }

}
