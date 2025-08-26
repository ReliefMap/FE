import { useState } from 'react';
import styles from './Login.module.scss';

import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

function Login() {
  const [showPassword, setShowPassword] = useState(false); // 기본: 숨김(눈 감김)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 로직
  };

  return (
    <div className={styles.loginBg}>
      <div className={styles.loginPanel}>
        <h2 className={styles.loginTitle}>로그인</h2>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {/* Email */}
          <div className={styles.field}>
            <HiMail className={styles.iconLeft} aria-hidden />
            <input
              id="username"
              type="text"
              className={styles.input}
              placeholder="이메일을 입력해 주세요"
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <HiLockClosed className={styles.iconLeft} aria-hidden />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="비밀번호를 입력해 주세요"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className={styles.iconRightBtn}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
            >
              {showPassword ? <HiEye /> : <HiEyeOff />}
            </button>
          </div>

          <button type="submit" className={styles.loginBtn}>로그인</button>
          <p className={styles.errorText} />
        </form>

        {/* 회원가입 / 비밀번호 재설정 */}
        <div className={styles.links}>
          <a href="/signup" className={styles.linkBtn}>이메일 회원가입</a>
        </div>
        <div className={styles.links}>
          <a href="/reset-password" className={styles.linkText}>비밀번호 재설정</a>
        </div>
        

        {/* 소셜 로그인 */}
        <div className={styles.socialSection}>
          <p className={styles.socialTitle}>SNS 계정으로 간편하게 로그인</p>
          <div className={styles.socialButtons}>
            <button className={`${styles.socialBtn} ${styles.google}`} onClick={() => console.log('구글 로그인')}>
              <img src="/icons/google.png" alt="google" />
              Google
            </button>
            <button className={`${styles.socialBtn} ${styles.kakao}`} onClick={() => console.log('카카오 로그인')}>
              <img src="/icons/kakao.png" alt="kakao" />
              Kakao
            </button>
            <button className={`${styles.socialBtn} ${styles.naver}`} onClick={() => console.log('네이버 로그인')}>
              <img src="/icons/naver.png" alt="naver" />
              Naver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
