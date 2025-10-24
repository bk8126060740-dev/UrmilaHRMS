

import * as CryptoJS from 'crypto-js';

export class GlobalConfiguration {
    public static consoleLog(pageName: string, message: String, log: any) {
        // Logging disabled for production
    }
    public static EncryptValue(value: any, _IsEncry?: string) {
        if (value != null && value != undefined) {
            if (_IsEncry != "NO") {
                var key = CryptoJS.enc.Utf8.parse('3c2759$#@$^0@EKG');
                var iv = CryptoJS.enc.Utf8.parse('3c2759$#@$^0@EKG');
                var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
                    {
                        keySize: 128 / 8,
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });

                return encrypted.toString();
            }
            else {
                return value;
            }
        }
    }
    public static DecryptValue(value: any, _IsDecry?: string) {
        if (value != null && value != undefined) {
            if (_IsDecry != "NO") {
                var key = CryptoJS.enc.Utf8.parse('3c2759$#@$^0@EKG');
                var iv = CryptoJS.enc.Utf8.parse('3c2759$#@$^0@EKG');
                var decrypted = CryptoJS.AES.decrypt(value, key, {
                    keySize: 128 / 8,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });


                return decrypted.toString();
            }
            else { return value; }
        }
    }
}
