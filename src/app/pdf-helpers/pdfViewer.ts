export class PdfViewer {
    constructor() {
    }

    preview(dataUri: string, documentTitle?: string): void {
        if (dataUri) {
            var cleanedDataUri = dataUri.replace('data:application/pdf;base64,', ''),
                blob = Base64Helper.base64toBlob(cleanedDataUri, 'application/pdf'),
                blobUrl = URL.createObjectURL(blob),
                printPreviewWindow = window.open(blobUrl);                                                                  //open the dataURI in new tab           

            if (printPreviewWindow) {
                new DetectWindowClosed(printPreviewWindow, () => { URL.revokeObjectURL(blobUrl); });                        //revoke the URL when the window was closed
                if (documentTitle) printPreviewWindow.document.title = documentTitle;
                setTimeout(()=> { printPreviewWindow.print(); }, 1000);                                                     //call print with timeout
            } else throw new Error('The application is unable to open a new tab because of the browsers security settings. Instructions: how to enable this feature.');
        } else throw new Error('Problems with PDF generation.');
    }

    previewFromServer(data: any): void {
        var file = new Blob([data], { type: 'application/pdf' }),
            fileURL = URL.createObjectURL(file),
            printPreviewWindow = window.open(fileURL);
        if (printPreviewWindow) {
            new DetectWindowClosed(printPreviewWindow, () => { URL.revokeObjectURL(fileURL); });                            //revoke the URL when the window was closed
            setTimeout(()=> { printPreviewWindow.print(); }, 1000);                                                         //call print with timeout
        } else throw new Error('The application is unable to open a new tab because of the browsers security settings. Instructions: how to enable this feature.');
    }
}

class Base64Helper {
    static base64toBlob(base64Data: string, contentType?: string): Blob {
        contentType = contentType || '';
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }
}

class DetectWindowClosed {                                                                                                  //detects when the window is closed
    constructor(
        theWindow: Window,
        onClosed: () => void,
        timeout: number = 2000
    ) {
        var timerId = window.setInterval(() => {                                                                            //by checking on an interval
            if (theWindow.closed) {                                                                                         //the closed property of the window
                onClosed();                                                                                                 //calling back 
                clearInterval(timerId);                                                                                     //clear the interval after window was closed
            }
        }, timeout);
    }
}