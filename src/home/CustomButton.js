export const CustomButton = ({ children, tabIndex=0, disabled=false, onClick=()=>{},type='button', as }) =>
  as !== 'span' ? (
    <button
      className="button-primary"
      type={type}
      tabIndex={tabIndex}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  ) : (
    <span className="button-primary" tabIndex={-1} aria-disabled={disabled}>
      {children}
    </span>
  );
  