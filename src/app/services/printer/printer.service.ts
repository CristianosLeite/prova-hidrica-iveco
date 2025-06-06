import { Injectable } from '@angular/core';
import { IPosPrinter } from 'ipos-printer';
import { TestResult } from 'src/app/types/testResult.type';
import { Operation } from 'src/app/types/operation.type';
import { InfiltrationGroup } from 'src/app/types/infiltrationGroup.type';
import InfiltrationGroups from 'src/app/models/infiltrationGroups.model';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private infiltrationGroups: { [key: string]: InfiltrationGroup } = InfiltrationGroups;
  private readonly defaultFontSize: number = 24; // Default font size for text
  public async printTestResult(testResult: TestResult, operation?: Operation): Promise<boolean> {
    await IPosPrinter.setPrinterPrintAlignment({ alignment: 1 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'TESTE PROVA HÍDRICA', typeface: 'ST', fontSize: 32 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 32 });

    await IPosPrinter.setPrinterPrintAlignment({ alignment: 0 });

    if (testResult.vp && testResult.vp !== 'Não informado') {
      await IPosPrinter.printSpecifiedTypeText({ text: 'VP:', typeface: 'ST', fontSize: this.defaultFontSize });
      await IPosPrinter.printSpecifiedTypeText({ text: testResult.vp, typeface: 'ST', fontSize: this.defaultFontSize });
      await IPosPrinter.printBlankLines({ lines: 1, height: 24 });
    }

    if (testResult.chassis && testResult.chassis !== 'Não informado') {
      await IPosPrinter.printSpecifiedTypeText({ text: 'CHASSI:', typeface: 'ST', fontSize: this.defaultFontSize });
      await IPosPrinter.printSpecifiedTypeText({ text: testResult.chassis, typeface: 'ST', fontSize: this.defaultFontSize });
      await IPosPrinter.printBlankLines({ lines: 1, height: 24 });
    }

    if (testResult.cabin && testResult.cabin !== 'Não informado') {
      await IPosPrinter.printSpecifiedTypeText({ text: 'CABINE:', typeface: 'ST', fontSize: this.defaultFontSize });
      await IPosPrinter.printSpecifiedTypeText({ text: testResult.cabin, typeface: 'ST', fontSize: this.defaultFontSize });
      await IPosPrinter.printBlankLines({ lines: 1, height: 24 });
    }

    if (testResult.cis && testResult.cis !== 'Não informado') {
      await IPosPrinter.printSpecifiedTypeText({ text: 'CIS:', typeface: 'ST', fontSize: this.defaultFontSize });
      await IPosPrinter.printSpecifiedTypeText({ text: testResult.cis, typeface: 'ST', fontSize: this.defaultFontSize });
      await IPosPrinter.printBlankLines({ lines: 1, height: 24 });
    }

    await IPosPrinter.printSpecifiedTypeText({ text: 'DESCRIÇÃO:', typeface: 'ST', fontSize: this.defaultFontSize });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.description, typeface: 'ST', fontSize: this.defaultFontSize });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'DATA:', typeface: 'ST', fontSize: this.defaultFontSize });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.date, typeface: 'ST', fontSize: this.defaultFontSize });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'HORA:', typeface: 'ST', fontSize: this.defaultFontSize });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.time, typeface: 'ST', fontSize: this.defaultFontSize });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'DURAÇÃO:', typeface: 'ST', fontSize: this.defaultFontSize });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.duration, typeface: 'ST', fontSize: this.defaultFontSize });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    await IPosPrinter.printSpecifiedTypeText({ text: 'OPERADOR:', typeface: 'ST', fontSize: this.defaultFontSize });
    await IPosPrinter.printSpecifiedTypeText({ text: testResult.operator, typeface: 'ST', fontSize: this.defaultFontSize });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    // Print group results header
    await IPosPrinter.printSpecifiedTypeText({ text: 'RESULTADOS POR GRUPO:', typeface: 'ST', fontSize: 28 });
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    if (operation) {
      // Update infiltration point values based on the operation
      this.updateInfiltrationPoints(operation);

      // Print groups and their infiltration points
      await this.printInfiltrationGroups();
    } else {
      // If no complete operation, only print general results
      await IPosPrinter.printColumnsText({ colsTextArr: ['TETO', `${testResult.upsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
      await IPosPrinter.printColumnsText({ colsTextArr: ['FRENTE', `${testResult.frontsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
      await IPosPrinter.printColumnsText({ colsTextArr: ['TETO POSTERIOR', `${testResult.backsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
      await IPosPrinter.printColumnsText({ colsTextArr: ['LADO ESQUERDO', `${testResult.leftsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
      await IPosPrinter.printColumnsText({ colsTextArr: ['LADO DIREITO', `${testResult.rightsideTestResult}`], colsWidthArr: [14, 14], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    }

    // Print general result
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });
    await IPosPrinter.printColumnsText({ colsTextArr: ['RESULTADO FINAL', `${testResult.status}`], colsWidthArr: [18, 10], colsAlignArr: [0, 2], isContinuousPrint: 1 });
    await IPosPrinter.printRowBlock();
    await IPosPrinter.printBlankLines({ lines: 1, height: 24 });

    // QR Code with operation ID
    await IPosPrinter.printQRCode({ data: testResult.operationId, moduleSize: 5, errorCorrectionLevel: 1 });
    await IPosPrinter.printBlankLines({ lines: 2, height: 24 });

    await IPosPrinter.setPrinterPrintAlignment({ alignment: 1 });
    await IPosPrinter.printBlankLines({ lines: 4, height: 32 });

    return true;
  }

  private updateInfiltrationPoints(operation: Operation): void {
    // Update the values of each infiltration point
    for (const group in this.infiltrationGroups) {
      this.infiltrationGroups[group].points.forEach(point => {
        const keyName = `InfPoint${point.id}`;
        point.value = operation[keyName] === true;
      });
    }
  }

  private async printInfiltrationGroups(): Promise<void> {
    const groups = [
      { key: 'Teto', displayName: 'TETO', testResultKey: 'upsideTestResult' },
      { key: 'Para-brisa', displayName: 'PARA-BRISA', testResultKey: 'frontsideTestResult' },
      { key: 'Teto posterior', displayName: 'TETO POSTERIOR', testResultKey: 'backsideTestResult' },
      { key: 'Lateral esquerda', displayName: 'LADO ESQUERDO', testResultKey: 'leftsideTestResult' },
      { key: 'Lateral direita', displayName: 'LADO DIREITO', testResultKey: 'rightsideTestResult' },
      { key: 'Cabine frontal', displayName: 'CABINE FRONTAL', testResultKey: 'frontsideTestResult' }
    ];

    for (const group of groups) {
      const groupData = this.infiltrationGroups[group.key];
      const hasFailure = groupData.points.some(point => point.value === true);
      const result = hasFailure ? 'NOK' : 'OK';

      // Print group header
      await IPosPrinter.printColumnsText({ colsTextArr: [group.displayName, result], colsWidthArr: [18, 10], colsAlignArr: [0, 2], isContinuousPrint: 1 });

      // If there are failures, print the failed points
      if (hasFailure) {
        // await IPosPrinter.printBlankLines({ lines: 1, height: 16 });
        await IPosPrinter.printSpecifiedTypeText({ text: 'Pontos de infiltração:', typeface: 'ST', fontSize: this.defaultFontSize });

        const failedPoints = groupData.points.filter(point => point.value === true);
        for (const point of failedPoints) {
          await IPosPrinter.printSpecifiedTypeText({ text: `- ${point.name}`, typeface: 'ST', fontSize: this.defaultFontSize });
        }
        await IPosPrinter.printBlankLines({ lines: 1, height: 16 });
      } else {
        await IPosPrinter.printBlankLines({ lines: 1, height: 16 });
      }
    }
  }
}
