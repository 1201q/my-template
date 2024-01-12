import { authService } from "@/utils/firebase/client";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { ChangeEvent, FormEvent, useState } from "react";
import { getAuthErrorMsg } from "@/utils/common/getAuthErrorMsg";
import styled from "styled-components";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassWord(value);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const loginData = {
      email: email,
      password: password,
    };

    event.preventDefault();

    signInEmail(loginData.email, loginData.password);
  };

  const signInEmail = async (
    email: string,
    password: string
  ): Promise<void> => {
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(authService, email, password);
      router.replace("/");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorMessage = getAuthErrorMsg(error.code);
        setErrorMsg(errorMessage);
      }
    }
  };

  const signInGoogle = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(authService, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log(user);
        router.replace("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container>
      <AuthContainer>
        <TopText>로그인</TopText>
        <FormContainer onSubmit={onSubmit}>
          <InputHeaderText>이메일</InputHeaderText>
          <Input
            type="email"
            value={email}
            name="email"
            onChange={onChange}
            placeholder="이메일을 입력하세요"
            required
          />
          <InputHeaderText>비밀번호</InputHeaderText>
          <Input
            type="password"
            value={password}
            name="password"
            placeholder="비밀번호를 입력하세요"
            onChange={onChange}
            minLength={6}
            required
          />
          <LoginButton type="submit">로그인</LoginButton>
        </FormContainer>

        <SignUpLink href="/auth/signup">회원가입</SignUpLink>

        <ErrorMessageText>{errorMsg}</ErrorMessageText>
        <SocialLoginButton onClick={signInGoogle}>
          Google로 로그인
        </SocialLoginButton>
      </AuthContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: white;
  display: flex;
  justify-content: center;
`;

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  max-width: 100vw;
  padding: 20px;
`;

const FormContainer = styled.form`
  width: 100%;
`;

const TopText = styled.p`
  font-size: 50px;
  font-weight: 800;
  margin-bottom: 30px;
`;

const InputHeaderText = styled.div`
  width: 100%;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  color: gray;
  margin-bottom: 8px;
`;

const Input = styled.input`
  /* padding만큼 빼기 */
  width: calc(100% - 20px);
  padding: 0px 10px;
  height: 34px;
  background-color: #f7f7f4;
  border: 1px solid lightgray;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 15px;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 36px;
  background-color: #2383e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  margin: 10px 0px 0px 0px;
`;

const SocialLoginButton = styled(LoginButton)`
  background-color: white;
  border: 1px solid lightgray;
  color: black;
  font-weight: 400;
  margin: 20px 0px 0px 0px;
`;

const ErrorMessageText = styled.div`
  margin-top: 15px;
  width: 100%;
  height: 40px;
  text-align: center;
  color: red;
`;

const SignUpLink = styled(Link)`
  width: 100%;
  margin-top: 15px;
  font-size: 14px;
  color: gray;
  text-align: right;
  text-decoration: underline;
  cursor: pointer;
`;

export default Login;
