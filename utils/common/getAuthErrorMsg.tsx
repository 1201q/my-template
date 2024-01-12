// 로그인, 회원가입 시 에러 메시지를 반환
export const getAuthErrorMsg = (code: string): string => {
  switch (code) {
    case "auth/user-not-found" || "auth/wrong-password":
      return "이메일 혹은 비밀번호가 일치하지 않습니다.";
    case "auth/email-already-in-use":
      return "이미 사용하는 이메일입니다.";
    case "auth/weak-password":
      return "비밀번호를 6자 이상 입력해주세요";
    case "auth/missing-password":
      return "비밀번호가 틀립니다.";
    case "auth/invalid-email":
      return "유효하지 않은 이메일 입니다.";
    case "auth/admin-restricted-operation":
      return "필수입력 사항을 작성해주세요.";
    case "auth/internal-error":
      return "잘못된 요청입니다.";
    case "auth/network-request-failed":
      return "네트워크 연결에 실패 하였습니다.";
    case "비밀번호가 일치하지 않습니다.":
      return "비밀번호가 일치하지 않습니다.";
    default:
      return "로그인할 수 없습니다.";
  }
};
