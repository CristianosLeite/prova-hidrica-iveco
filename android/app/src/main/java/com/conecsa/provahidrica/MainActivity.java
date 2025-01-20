package com.conecsa.provahidrica;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import androidx.core.app.ActivityCompat;
import android.Manifest;
import android.content.pm.PackageManager;
import android.widget.Toast;

public class MainActivity extends BridgeActivity {
  private static final int REQUEST_WRITE_STORAGE = 112;
  private static final int REQUEST_BLUETOOTH = 113;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    if (ActivityCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_WRITE_STORAGE);
    }

    if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH) != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.BLUETOOTH}, REQUEST_BLUETOOTH);
    }

    registerPlugin(com.conecsa.ipos.printer.service.IPosPrinterPlugin.class);
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    if (requestCode == REQUEST_WRITE_STORAGE || requestCode == REQUEST_BLUETOOTH) {
      if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        Toast.makeText(this, "Permissão concedida", Toast.LENGTH_SHORT).show();
      } else {
        Toast.makeText(this, "Permissão negada", Toast.LENGTH_SHORT).show();
      }
    }
  }
}
