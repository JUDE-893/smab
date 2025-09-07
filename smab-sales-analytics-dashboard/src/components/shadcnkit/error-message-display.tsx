export function DisplayErrorMessage({error, className}) {

  let message;

  switch (error?.code) {
    case "ERR_NETWORK":
      message = "Please check your network!"
      break;
    case "ECONNABORTED":
      message = "Oops! Something went wrong."
      break;
    default:
      message = "Oops! Something went wrong."
      break;
  }

  return (
    <div className={'flex justify-center items-center w-full text-destructive italic ' + className}>
      {message}
    </div>
  )
}
