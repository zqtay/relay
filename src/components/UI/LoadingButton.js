const LoadingButton = ({ className="", onClick, isLoading, text = "OK", isLoadingText = " Loading... " }) => {
    return (
        <button type="button" className={`btn btn-primary ${className}`} onClick={onClick} disabled={isLoading}>
            {isLoading && <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>}
            {isLoading && isLoadingText}
            {!isLoading && text}
        </button>
    );
};

export default LoadingButton;