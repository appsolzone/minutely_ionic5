import { Injectable } from "@angular/core";

import * as papa from 'papaparse';

import * as XLSX from 'xlsx';

import { Plugins, FilesystemDirectory, Capacitor } from "@capacitor/core";

import { HttpClient, HttpEventType, HttpHeaders } from "@angular/common/http";
const { Browser, Filesystem, Share } = Plugins;

@Injectable({
  providedIn: "root",
})
export class FileManagementService {
  //================
  // fileTransferObject: FileTransferObject;
  directories: any;
  constructor(
    private http: HttpClient,
  ) {}

  async listDir(){
    await Filesystem.readdir({path:'/',directory: FilesystemDirectory.Cache}).then(res => {
        this.directories = res;
        // alert("New sets " + JSON.stringify(this.directories))
      });
  }

  createCsv(data){
    let csv = papa.unparse(data);
    // papa.unparse({
    //   fields: this.headerRow,
    //   data: this.csvData
    // });
    // console.log("csv data by unparse", csv);
    return csv;

  }

  createXlsx(json: any[]) {
  // createXlsx(data: any[], excelFileName: string) {
    // console.log("createXlsx", json);
    let workbook: XLSX.WorkBook={Sheets:{},SheetNames:[]};
    Object.keys(json).forEach(sheet=>{
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[sheet]);
      workbook.Sheets[sheet] = worksheet;
      workbook.SheetNames.push(sheet);
    })
    // XLSX.writeFile(workbook, 'report.xlsx');
    let wbout = XLSX.write(workbook, {
              bookType: 'xlsx',
              bookSST: false,
              type: 'binary'
            });
    return wbout;
  }

  s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  // give user a choice to open his
  // preferable apps for opening this
  // file
  // async dialogOpen(filePath, mimeType) {
  //   if (Capacitor.platform !== 'web') {
  //     this.fileOpener
  //       .showOpenWithDialog(filePath, mimeType)
  //       .then(() => console.log("File is opened"))
  //       .catch((e) => {
  //         alert("Error opening file " + e)
  //         console.log("Error opening file", e)
  //       });
  //   } else {
  //     await Browser.open({ url: filePath });
  //   }
  // }

  // if we want to store file using
  // capacitor we need to covert it in
  // base64 before
  // annoymous function
  // **Note: if the files size bigger use another capacitor plugin 'https://www.npmjs.com/package/capacitor-blob-writer'

  convertBlobToBase64(blob: Blob, webFlag = false) {
    return new Promise((resolve, reject) => {
      console.log("blob parameter:", blob);
      // use js FileReader class/object
      // asynchronously
      // more info:'https://developer.mozilla.org/en-US/docs/Web/API/FileReader'

      const reader = new FileReader();
      reader.onerror = (err) => {
        console.log(err);
        return reject(err);
      };
      reader.onload = () => {
        console.log(reader.result);
        resolve(reader.result);
        // if(webFlag)window.open(url,'_blank', '');
      };
      reader.readAsDataURL(blob);
    });
  }

  // type checking
  getType(name) {
    if (name.indexOf("pdf") >= 0) {
      return 'text/plain'; //"application/pdf";
    } else if (name.indexOf("csv") >= 0) {
      return "text/plain"; //"text/csv";
    } else if(name.indexOf("xlsx")>=0){
      return 'application/octet-stream';
    }
    return 'text/plain';
  }

  async downloadFile(fileData, name, fileType:string='csv') {
    let data: any = null;
    if(fileType=='csv'){
      data = this.createCsv(fileData);
      console.log("csv data", data);
    } else if(fileType=='xlsx'){
      let xlsxData = this.createXlsx(fileData);
      data = this.s2ab(xlsxData);
    }
    if ( Capacitor.platform === 'web' ) {
      console.log("function called");
      this.downloadFileWeb(data, name);
    } else if ( Capacitor.platform !== 'web' ){
      let type = this.getType(name);
      let blob: any = new Blob([data], { type: type });
      // get base64 string
      const base64: any = await this.convertBlobToBase64(blob);
      // alert("file name:" + name +  "base64:");
      console.log("file name:", name, "base64:", base64);

      // saved file in to document directory
      // FilesystemDirectory.Cache both android & ios
      // saved in document directory

      /**
       * The external storage directory
       * On iOS it will use the Documents directory
       * On Android it's the primary shared/external storage directory.
       * It's not accesible on Android 10 unless the app enables legacy External Storage
       * by adding `android:requestLegacyExternalStorage="true"` in the `application` tag
       * in the `AndroidManifest.xml`
       */
      const savedResult = await Filesystem.writeFile({
        path: name,
        data: base64,
        directory: FilesystemDirectory.Cache,
      });

      // alert("after save result write file" + FilesystemDirectory.Cache);

      console.log("saved :", savedResult);

      // get the uri and open the file in device
      const path = savedResult.uri;
      const mimeType = this.getType(name);
      console.log("saved uri:", savedResult.uri);
      // open in default file reader apps
      // this.open(path, mimeType);
      // this.fileOpener.showOpenWithDialog(result.uri, 'application/json')
      // this.dialogOpen(path, mimeType);
      await Share.share({
        title: name, //'Shave or share',
        text: 'Save or share the data',
        url: path, //'http://ionicframework.com/',
        dialogTitle: 'Save or share',
      });
      // Storage set for imediate query
      // Storage.set({
      // })
    }
  }

  downloadFileWeb(data, name) {
    // get the mimeType
    const mimeType = this.getType(name);
    let blob: any = new Blob([data], { type: mimeType });
    // open in another web tab with blob data
    const url = window.URL.createObjectURL(blob);

    // append a <a> tag for download
    var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.download = name;
    document.body.appendChild(a);
    // start download
    a.click();
    document.body.removeChild(a);

    console.log(a);
  }
}
