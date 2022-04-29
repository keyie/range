import { formatNumber, getMonth } from './index'


interface WEEK_ENABLE {
  [key: number]: string[], // 字段扩展声明
};

export const getWeeks = {
  run: function (year: number, month?: number) {
    let days = getWeeks.getDate(Number(year) || new Date().getFullYear(), month)
    let weeks: WEEK_ENABLE = {};

    for (let i = 0; i < days.length; i++) {
      let weeksKeyLen = Object.keys(weeks).length;
      let daySplit = days[i].split('_');

      if (weeks[weeksKeyLen] == undefined) {
        weeks[weeksKeyLen + 1] = [daySplit[0]]
      } else {
        if (daySplit[1] == '1') {
          weeks[weeksKeyLen + 1] = [daySplit[0]]
        } else {
          weeks[weeksKeyLen].push(daySplit[0])
        }
      }
    }
    return weeks
  },
  getDate: function (year: number, month?: number) {
    let dates = []
    let start_index = 1
    let end_index = 12
    if (month) {
      start_index = month
      end_index = month
    }
    for (let i = start_index; i <= end_index; i++) {
      for (let j = 1; j <= new Date(year, i, 0).getDate(); j++) {
        let par = [year, String(i).length < 2 ? `0${i}` : i, String(j).length < 2 ? `0${j}` : j].join('-')
        dates.push(year + '-' + formatNumber(i) + '-' + formatNumber(j) + '_' + new Date(par).getDay())
      }
    }
    return dates
  }
}


// 根据数组获取所属周
export const getBelongWeeks = function (weeks: WEEK_ENABLE, date: string): string[] {
  let be_ary: string[] = [], index: number = 1;
  for (let i in weeks) {
    let val = weeks[i]

    if (val.includes(date)) {
      be_ary = val
      index = Number(i)
      break
    }
  }

  if (be_ary.length < 7) {
    index = index === 1 ? -1 : 1
    let date_str = getMonth(new Date(date), index, 'yyyy-MM-dd')
    let date_ary: string[] = []
    let after_length = 0
    if (typeof date_str === 'string') {
      date_ary = date_str.split('-')
    }

    let after_month = getWeeks.run(Number(date_ary[0]), Number(date_ary[1]))
    if (index === -1) {
      after_length = Object.keys(after_month).length
      be_ary = [...after_month[after_length], ...be_ary]
    } else if (index === 1) {
      after_length = 1
      be_ary = [...be_ary, ...after_month[after_length]]
    }
  }

  return be_ary
}


// 获取指定年，月第一天
export const get_targetWeekData = function (scope_type: string, scope_date: string, target_num: number, is_order: boolean): string {
  let date = new Date(scope_date)
  let weeks_ary: String[] = [];
  if (scope_type === 'year') {
    weeks_ary = Object.values(getWeeks.run(date.getFullYear()))
  } else if (scope_type === 'month') {
    weeks_ary = Object.values(getWeeks.run(date.getFullYear(), date.getMonth() + 1))
  }


  if (weeks_ary[0].length < 7) {
    weeks_ary.splice(0, 1)
  }
  let i = target_num % weeks_ary.length
  if (i === 0) i = weeks_ary.length

  if(!is_order) {
    weeks_ary = weeks_ary.reverse()
  } 
  i = i - 1
  return weeks_ary[i][0]
}