import { IncomeStatement } from '@/lib/types';

function IncomeTableRow({ name, value, revenue }: { name: string, value: number, revenue: number }) {
  return (
    <tr>
      <th>{name}</th>
      <td>{value.toLocaleString()}</td>
      <td>{`${(value / revenue * 100).toFixed(2)}%`}</td>
    </tr>
  )
}

export function IncomeTable({ incomes }: { incomes: IncomeStatement }) {
  return (
    <table className='incomeTable'>
      <thead>
        <tr>
          <th>項目</th>
          <th>金額（新台幣）</th>
          <th>佔比</th>
        </tr>
      </thead>
      <tbody>
        <IncomeTableRow name='營業收入' value={incomes.revenue} revenue={incomes.revenue}/>
        <IncomeTableRow name='營業成本' value={incomes.cost} revenue={incomes.revenue}/>
        <IncomeTableRow name='營業毛利' value={incomes.revenue - incomes.cost} revenue={incomes.revenue}/>
        <IncomeTableRow name='營業費用' value={incomes.expense} revenue={incomes.revenue}/>
        <IncomeTableRow name='營業利益' value={incomes.revenue - incomes.cost - incomes.expense} revenue={incomes.revenue}/>
        <IncomeTableRow name='業外損益' value={incomes.otherIncome} revenue={incomes.revenue}/>
        <IncomeTableRow name='稅前淨利' value={incomes.revenue - incomes.cost - incomes.expense + incomes.otherIncome} revenue={incomes.revenue}/>
        <IncomeTableRow name='所得稅'   value={incomes.tax} revenue={incomes.revenue}/>
        <IncomeTableRow name='稅後淨利' value={incomes.revenue - incomes.cost - incomes.expense + incomes.otherIncome - incomes.tax} revenue={incomes.revenue}/>
      </tbody>
    </table>
  )
}

