function RunButton({ onClick, isRunning, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={isRunning || disabled}
      className={`w-full px-4 py-2 text-sm font-mono font-medium border-none cursor-pointer ${
        isRunning || disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        isRunning
          ? 'bg-surface text-muted'
          : 'bg-accent text-black'
      }`}
    >
      {isRunning ? 'RUNNING...' : 'RUN'}
    </button>
  )
}

export default RunButton
