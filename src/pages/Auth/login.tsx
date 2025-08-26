import { useState } from 'react';
import styles from './Login.module.scss';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

type Errors = { email?: string; password?: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function Login() {
  const [showPassword, setShowPassword] = useState(false); // 기본: 숨김(눈 감김)
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState<Errors>({});

  const validate = (v = values): Errors => {
    const e: Errors = {};
    if (!v.email.trim()) e.email = '이메일을 입력해 주세요.';
    else if (!emailRe.test(v.email)) e.email = '올바른 이메일 형식이 아니에요.';
    if (!v.password) e.password = '비밀번호를 입력해 주세요.';
    else if (v.password.length < 8) e.password = '비밀번호는 8자 이상이어야 해요.';
    return e;
  };

  const handleChange =
    (key: 'email' | 'password') =>
      (ev: React.ChangeEvent<HTMLInputElement>) => {
        const next = { ...values, [key]: ev.target.value };
        setValues(next);
        setErrors(validate(next)); // 입력 즉시 검증
      };

  const handleBlur = (key: 'email' | 'password') => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate());
  };

  const hasError = (k: keyof Errors) => !!errors[k] && touched[k];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    setTouched({ email: true, password: true });
    if (Object.keys(eMap).length > 0) return;
    // ✅ 여기에 서버 요청 로직(axios/react-query) 연결
    console.log('login submit', values);
  };

  const isInvalid = Object.keys(validate()).length > 0;

  return (
    <div className={styles.loginBg}>
      <div className={styles.loginPanel}>
        <h2 className={styles.loginTitle}>로그인</h2>

        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className={`${styles.field} ${hasError('email') ? styles.fieldError : ''}`}>
            <HiMail className={styles.iconLeft} aria-hidden />
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              placeholder="이메일을 입력해 주세요"
              autoComplete="email"
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              aria-invalid={hasError('email')}
              aria-describedby="email-help"
              required
            />
          </div>
          {/* 메시지: touched 되었을 때만 출력 */}
          {touched.email && errors.email && (
            <div className={styles.helpRow}>
              <span id="email-help" className={styles.msgError}>
                {errors.email}
              </span>
            </div>
          )}

          {/* Password */}
          <div className={`${styles.field} ${hasError('password') ? styles.fieldError : ''}`}>
            <HiLockClosed className={styles.iconLeft} aria-hidden />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              placeholder="비밀번호를 입력해 주세요"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              aria-invalid={hasError('password')}
              aria-describedby="pw-help"
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
          {/* 메시지: touched 되었을 때만 출력 */}
          {touched.password && errors.password && (
            <div className={styles.helpRow}>
              <span id="pw-help" className={styles.msgError}>
                {errors.password}
              </span>
            </div>
          )}

          <button type="submit" className={styles.loginBtn} disabled={isInvalid}>
            로그인
          </button>

          {/* 서버 응답 에러 등 글로벌 에러 메시지 영역 */}
          <p className={styles.errorText} />
        </form>

        {/* 회원가입(가운데) / 비밀번호 재설정(오른쪽) */}
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
            <button className={`${styles.socialBtn} ${styles.google}`}>
              <img src="/icons/google.png" alt="google" />
              Google
            </button>
            <button className={`${styles.socialBtn} ${styles.kakao}`}>
              <img src="/icons/kakao.png" alt="kakao" />
              Kakao
            </button>
            <button className={`${styles.socialBtn} ${styles.naver}`}>
              <img src="/icons/naver.png" alt="naver" />
              Naver
            </button>
          </div>
        </div>
      </div >
    </div >
  );
}

export default Login;
