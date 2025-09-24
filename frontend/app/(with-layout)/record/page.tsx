'use client'

import { Context, Setter } from "@/lib/types";
import { useState } from "react";
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';
import styles from './page.module.scss'

interface RecordEntry {
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface PurchaseRecord {
  direction: string;
  id: string;
  date: Date;
  object: string;
  paymentMethod: string;
  entries: RecordEntry[];
}

function RecordTab({ name, index, setIndex }: { name: string, index: number, setIndex: Setter<number> }) {
  return (
    <button className={styles.recordTab} onClick={() => setIndex(index)}>
      {name}
    </button>
  )
}

function SimpleField({ name, type, context, field }: {
  name: string,
  type: string,
  context: Context<PurchaseRecord>,
  field: 'direction' | 'id' | 'date' | 'object' | 'paymentMethod',
}) {
  return (
    <div>
      <label style={{ marginRight: '1em' }}>{name}</label>
      <input
        type={type}
        value={
          type === 'text' ?
          context.value[field] as unknown as string :
          (context.value[field] as Date).toISOString().split('T')[0] as unknown as string
        }
        onChange={(e) => context.setValue({...context.value, [field]: e.target.value})}
      />
    </div>
  );
}

function ItemTableCell({ context, index, field }: {
  context: Context<PurchaseRecord>,
  index: number,
  field: 'name' | 'quantity' | 'unit' | 'price',
}) {
  return (
    <td>
      <input
        type={field == 'name' || field == 'unit' ? 'text' : 'number'}
        value={context.value.entries[index][field]}
        onChange={(e) => {
          const copy = context.value.entries;
          (copy[index][field] as string) = e.target.value;
          context.setValue({
            ...context.value,
            entries: copy
          });
        }}
      />
    </td>
  );
}

function ItemTable({ context }: { context: Context<PurchaseRecord> }) {
  return (
    <div className={styles.itemTable}>
      <table>
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>數量</th>
            <th>單位</th>
            <th>單價</th>
            <th>小計</th>
          </tr>
        </thead>
        <tbody>
          {context.value.entries.map((_, i) => (
            <tr key={i}>
              <ItemTableCell context={context} index={i} field='name' />
              <ItemTableCell context={context} index={i} field='quantity' />
              <ItemTableCell context={context} index={i} field='unit' />
              <ItemTableCell context={context} index={i} field='price' />
              <td style={{ textAlign: 'right' }}>{context.value.entries[i].quantity * context.value.entries[i].price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => context.setValue({
        ...context.value,
        entries: [...context.value.entries, {name: '', quantity: 0, unit: '', price: 0}]
      })}>+</button>
    </div>
  );
}

function VisibleRecord({ contexts, index }: { contexts: Context<PurchaseRecord>[], index: number }) {

  return (
    <form style={{ margin: '2em' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <SimpleField name='單號' type='text' context={contexts[index]} field='id' />
          <SimpleField name='日期' type='date' context={contexts[index]} field='date' />
          <SimpleField name={`${index ? '客戶' : `供應商`}名稱`} type='text' context={contexts[index]} field='object' />
          <SimpleField name={`${index ? '收' : `付`}款方式`} type='text' context={contexts[index]} field='paymentMethod' />
        </div>
        <div className={styles.csvButtons}>
          <CSVLink
            data={contexts[index].value.entries}
            filename={`${contexts[index].value.id}_${contexts[index].value.date}_${contexts[index].value.object}_${contexts[index].value.paymentMethod}.csv`}
          >匯出 CSV</CSVLink>
          <button type='button' onClick={() => document.getElementById('csvImport')?.click()}>匯入 CSV</button>
          <input id='csvImport' type='file' accept='.csv' style={{ display: 'none' }} onChange={(e) => {
            const metas: string[] = e.target.value.split(/(\\|\/)/g).pop()?.split('.')[0].split('_')!;
            const file = e.target.files![0];
            Papa.parse(file, { header: true, complete: (res) => {
              contexts[index].setValue({
                direction: index ? 'export' : 'import',
                id: metas[0],
                date: new Date(metas[1]),
                object: metas[2],
                paymentMethod: metas[3],
                entries: res.data as RecordEntry[]
              });
            }});
          }} />
        </div>
      </div>
      <ItemTable context={contexts[index]} />
    </form>
  )
}

export default function Record() {
  const [importRecord, setImportRecord] = useState({
    direction: 'import', id: '', date: new Date(), object: '', paymentMethod: '', entries: [] as RecordEntry[]
  });
  const [exportRecord, setExportRecord] = useState({
    direction: 'export', id: '', date: new Date(), object: '', paymentMethod: '', entries: [] as RecordEntry[]
  });
  const [index, setIndex] = useState(0);
  const contexts: Context<PurchaseRecord>[] = [
    { value: importRecord, setValue: setImportRecord },
    { value: exportRecord, setValue: setExportRecord },
  ]

  return (
    <main className={styles.pageContent}>
      <div style={{ display: 'flex' }}>
        <RecordTab name="進貨" index={0} setIndex={setIndex} />
        <RecordTab name="銷貨" index={1} setIndex={setIndex} />
      </div>
      <VisibleRecord contexts={contexts} index={index} />
    </main>
  );
}

