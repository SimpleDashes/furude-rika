interface IWithTaskCompletionListener {
  onError?: () => void;
  onSuccess?: () => void;
}
