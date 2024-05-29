export const stringToDate = (dateString)=>{
    const [day, month, year] = dateString.split("-");
    const date = new Date(year,month-1,day);
return date;
}