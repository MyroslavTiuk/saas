import {getAccessToken} from "../utils/helper";

export function AuthenticatedLink({url, filename, children}) {
  const handleAction = async () => {
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
      <a className="reportBtn btn d-flex align-items-center" role='button'
         onClick={handleAction}>{children}</a>
    </>
  )
}