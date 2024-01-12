import { authService } from "@/utils/firebase/client";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { getAuthErrorMsg } from "@/utils/common/getAuthErrorMsg";

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [password, setPassWord] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassWord(value);
    } else if (name === "check-password") {
      setCheckPassword(value);
    } else if (name === "name") {
      setName(value);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const loginData = {
      email: email,
      password: password,
    };

    event.preventDefault();

    if (password === checkPassword) {
      signUpEmail(loginData.email, loginData.password);
    } else {
      setErrorMsg("비밀번호가 동일한지 다시 확인하세요.");
    }
  };

  const signUpEmail = async (
    email: string,
    password: string
  ): Promise<void> => {
    setErrorMsg("");
    createUserWithEmailAndPassword(authService, email, password)
      .then(async (userObj) => {
        await updateProfile(userObj.user, { displayName: name });
        router.replace("/");
      })
      .catch((error: unknown) => {
        if (error instanceof FirebaseError) {
          console.log(error.code);
          const errorMessage = getAuthErrorMsg(error.code);
          setErrorMsg(errorMessage);
        }
      });
  };

  useEffect(() => {
    if (checkPassword.length >= 5) {
      if (password !== checkPassword) {
        setErrorMsg("비밀번호가 동일한지 다시 확인하세요.");
      } else {
        setErrorMsg("");
      }
    } else {
      setErrorMsg("");
    }
  }, [checkPassword]);

  return (
    <Container>
      <AuthContainer>
        <TopText>회원가입</TopText>
        <FormContainer onSubmit={onSubmit}>
          <InputHeaderText>이메일</InputHeaderText>
          <Input
            type="email"
            value={email}
            name="email"
            onChange={onChange}
            placeholder="이메일을 입력하세요."
            required
          />
          <InputHeaderText>비밀번호</InputHeaderText>
          <Input
            type="password"
            value={password}
            name="password"
            placeholder="비밀번호를 입력하세요."
            onChange={onChange}
            minLength={6}
            required
          />
          <InputHeaderText>비밀번호 확인</InputHeaderText>
          <Input
            type="password"
            value={checkPassword}
            name="check-password"
            placeholder="비밀번호를 다시 입력하세요."
            onChange={onChange}
            minLength={6}
            required
          />
          <InputHeaderText>이름</InputHeaderText>
          <Input
            type="text"
            value={name}
            name="name"
            placeholder="사용할 닉네임을 입력하세요."
            onChange={onChange}
            minLength={2}
            required
          />
          <LoginButton type="submit">회원가입</LoginButton>
        </FormContainer>
        <ErrorMessageText>{errorMsg}</ErrorMessageText>
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
  margin: 20px 0px 0px 0px;
`;

const ErrorMessageText = styled.div`
  margin-top: 25px;
  width: 100%;
  height: 40px;
  text-align: center;
  color: red;
`;

export default SignUp;
