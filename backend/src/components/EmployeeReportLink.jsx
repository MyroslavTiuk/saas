import {getAccessToken} from "../utils/helper";

export function EmployeeReportLink({url, filename, children}) {
  const handleEmployAction = async () => {
    const result = await fetch(url, {
      headers: {
        Authorization: getAccessToken(),
      }
    })

    const blob = await result.blob();
    let link = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = link;
    a.download = `${filename}.pdf`;
    a.click();
  }

  return (
    <>
      <a className="viewButton text-decoration-none" role='button'
         onClick={handleEmployAction}>{children}</a>
    </>
  )
}