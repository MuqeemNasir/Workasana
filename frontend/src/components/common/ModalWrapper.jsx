const ModalWrapper = ({ title, onClose, children, maxWidth = "500px" }) => {
  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth }}>
        <div className="modal-content custom-modal-content">
          <div className="custom-modal-header d-flex justify-content-between align-items-center">
            <h5 className="custom-modal-title mb-0">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              style={{ fontSize: "0.75rem" }}
            ></button>
          </div>

          <div className="custom-modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
