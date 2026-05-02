/* 
  GOOGLE APPS SCRIPT BACKEND FOR LSP SMK TANJUNG PRIOK 1
  Spreadsheet ID: 1kuG0_5-7hK7zjCUGjoBUUZAMGqzrScUFxa7M0iXoUBw
*/

const SPREADSHEET_ID = '1kuG0_5-7hK7zjCUGjoBUUZAMGqzrScUFxa7M0iXoUBw';

function doPost(e) {
  const charSet = "UTF-8";
  var result = { status: 'error', message: 'Unknown action' };
  
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    if (action === 'login') {
      const sheet = ss.getSheetByName('User_Auth');
      const rows = sheet.getDataRange().getValues();
      const headers = rows[0];
      
      const idx = {
        userId: headers.indexOf('UserID'),
        username: headers.indexOf('Username'),
        password: headers.indexOf('Password_Hash'),
        role: headers.indexOf('Role'),
        nama: headers.indexOf('Nama'),
        nisn: headers.indexOf('NISN')
      };

      const username = data.username;
      const password = data.password;
      
      for (var i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row[idx.username] == username && row[idx.password] == password) {
          result = { 
            status: 'success', 
            user: {
              userId: row[idx.userId],
              username: row[idx.username],
              role: row[idx.role],
              nama: row[idx.nama],
              nisn: row[idx.nisn]
            }
          };
          break;
        }
      }
      if (result.status === 'error') result.message = 'Kredensial tidak valid di kolom Username/Password_Hash';
    } 

    else if (action === 'saveAPL01') {
      const sheet = ss.getSheetByName('Data_APL01');
      const idReg = 'REG-' + new Date().getTime();
      const newRow = [
        idReg,
        data.userId,
        new Date(),
        data.namaSkema,
        data.alamat,
        data.linkBerkas,
        'Pending', // Status
        data.ttdAsesi
      ];
      sheet.appendRow(newRow);
      result = { status: 'success', idReg: idReg };
    }

    else if (action === 'saveAPL02') {
      const sheet = ss.getSheetByName('Data_APL02');
      const idAsesmen = 'ASM-' + new Date().getTime();
      const units = data.units; // Array of objects
      
      units.forEach((unit, index) => {
        sheet.appendRow([
          idAsesmen + '-' + index,
          data.idReg,
          unit.kodeUnit,
          unit.judulUnit,
          unit.jawaban,
          unit.linkBukti,
          '' // Rekomendasi Asesor
        ]);
      });
      result = { status: 'success' };
    }

    else if (action === 'readData') {
      const type = data.type;
      const sheet = ss.getSheetByName(type);
      const rows = sheet.getDataRange().getValues();
      const headers = rows[0];
      const items = [];
      
      for (var i = 1; i < rows.length; i++) {
        var item = {};
        for (var j = 0; j < headers.length; j++) {
          item[headers[j]] = rows[i][j];
        }
        
        // Filter based on user if requested
        if (data.userId && item.UserID !== data.userId && item.UserID != undefined) continue;
        
        items.push(item);
      }
      result = { status: 'success', data: items };
    }

    else if (action === 'updateStatus') {
      const sheet = ss.getSheetByName('Data_APL01');
      const rows = sheet.getDataRange().getValues();
      const idReg = data.idReg;
      const newStatus = data.status;
      
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][0] === idReg) {
          sheet.getRange(i + 1, 7).setValue(newStatus);
          result = { status: 'success' };
          break;
        }
      }
    }

  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("LSP SMK Tanjung Priok 1 Backend is Running")
    .setMimeType(ContentService.MimeType.TEXT);
}
