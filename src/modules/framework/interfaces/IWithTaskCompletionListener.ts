interface IWithTaskCompletionListener {
  onError?: () => void;
  onSuccess?: () => void;
}

export default IWithTaskCompletionListener;
