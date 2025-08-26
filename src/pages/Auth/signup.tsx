import { useState } from 'react';
import styles from './Signup.module.scss';
import {
    HiUser, HiPhone, HiMail, HiLockClosed, HiEye, HiEyeOff
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneRe = /^[0-9]{10,11}$/;

const steps = ['약관동의', '정보입력', '가입완료'];

export default function Signup() {
    const [step, setStep] = useState(1);
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const [values, setValues] = useState({
        name: '', phone: '', email: '', code: '', password: '', confirm: '',
        ageGroup: '' as '' | 'over14' | 'under14',
        agreeAll: false, agreeTos: false, agreePrivacy: false, agreeMarketing: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validate = () => {
        const e: Record<string, string> = {};
        if (step === 1) {
            if (!values.ageGroup) e.ageGroup = '연령대를 선택해 주세요.';
            if (!values.agreeTos) e.agreeTos = '이용약관 동의가 필요합니다.';
            if (!values.agreePrivacy) e.agreePrivacy = '개인정보 수집 동의가 필요합니다.';
        } else if (step === 2) {
            if (!values.name.trim()) e.name = '이름을 입력해 주세요.';
            if (!values.phone) e.phone = '전화번호를 입력해 주세요.';
            else if (!phoneRe.test(values.phone)) e.phone = '전화번호 형식이 올바르지 않아요.';
            if (!values.email) e.email = '이메일을 입력해 주세요.';
            else if (!emailRe.test(values.email)) e.email = '이메일 형식이 올바르지 않아요.';
            if (!values.password) e.password = '비밀번호를 입력해 주세요.';
            else if (values.password.length < 8) e.password = '비밀번호는 8자 이상이어야 해요.';
            if (!values.confirm) e.confirm = '비밀번호 확인을 입력해 주세요.';
            else if (values.confirm !== values.password) e.confirm = '비밀번호가 일치하지 않아요.';
        }
        return e;
    };

    const handleChange = (key: keyof typeof values) => (ev: React.ChangeEvent<HTMLInputElement>) => {
        const val = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;
        const next = { ...values, [key]: val };

        if (key === 'agreeAll') {
            next.agreeTos = next.agreePrivacy = next.agreeMarketing = !!val;
        }
        if (["agreeTos", "agreePrivacy", "agreeMarketing"].includes(key)) {
            const allChecked = next.agreeTos && next.agreePrivacy && next.agreeMarketing;
            next.agreeAll = allChecked;
        }

        setValues(next);
        if (touched[key]) setErrors(validate());
    };

    const handleBlur = (key: string) => {
        setTouched((prev) => ({ ...prev, [key]: true }));
        setErrors(validate());
    };

    const nextStep = () => {
        const errs = validate();
        setErrors(errs);
        setTouched((prev) => ({
            ...prev,
            ...(step === 1
                ? { ageGroup: true, agreeTos: true, agreePrivacy: true }
                : { name: true, phone: true, email: true, password: true, confirm: true })
        }));
        if (Object.keys(errs).length > 0) return;
        setStep((s) => s + 1);
    };

    const hasError = (k: string) => !!errors[k] && touched[k];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
        if (Object.keys(errs).length > 0) return;
        setStep(3);
    };

    return (
        <div className={styles.bg}>
            <div className={styles.panel}>
                <h2 className={styles.title}>회원가입</h2>

                <div className={styles.stepBar}>
                    {steps.map((label, index) => {
                        const isDone = index + 1 < step;
                        const isActive = index + 1 === step;
                        const isCurrent = index + 1 <= step;

                        const goToStep = () => {
                            // 현재보다 이전 단계로만 이동 가능하도록 제한
                            if (index + 1 < step) {
                                setStep(index + 1);
                            }
                        };

                        return (
                            <div key={label} className={styles.stepItem} onClick={goToStep} style={{ cursor: index + 1 < step ? 'pointer' : 'default' }}>
                                <div className={`${styles.circle} ${isCurrent ? styles.done : ''}`}>
                                    {isCurrent ? '✓' : ''}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`${styles.line} ${step > index + 1 ? styles.filled : ''}`} />
                                )}
                                <div className={`${styles.label} ${isActive ? styles.labelActive : ''}`}>{label}</div>
                            </div>
                        );
                    })}
                </div>


                <form className={styles.form} onSubmit={submit} noValidate>
                    {/* Step 1 */}
                    {step === 1 && (
                        <>
                            {/* ... 생략 없이 약관 체크 필드 전체 */}
                            <fieldset className={styles.fieldset}>
                                <legend className={styles.sectionTitle}>연령대 선택</legend>
                                <div className={styles.ageGroupRadios}>
                                    {[{ value: 'over14', label: '만 14세 이상입니다' }, { value: 'under14', label: '만 14세 미만입니다', sub: '보호자 동의가 필요합니다' }].map((item) => (
                                        <label key={item.value} className={`${styles.radioItem} ${values.ageGroup === item.value ? styles.selected : ''}`}>
                                            <input type="radio" name="ageGroup" value={item.value} checked={values.ageGroup === item.value} onChange={handleChange('ageGroup')} onBlur={() => handleBlur('ageGroup')} />
                                            <span className={styles.radioVisual} />
                                            <span className={styles.radioTextMain}>{item.label}</span>
                                            {item.sub && <span className={styles.radioTextSub}>{item.sub}</span>}
                                        </label>
                                    ))}
                                </div>
                                {hasError('ageGroup') && <div className={styles.msgError}>{errors.ageGroup}</div>}
                            </fieldset>

                            <div className={styles.divider} />

                            <label className={styles.checkRow}>
                                <input type="checkbox" checked={values.agreeAll} onChange={handleChange('agreeAll')} />
                                <span>전체동의</span>
                            </label>
                            <label className={styles.checkRow}>
                                <input type="checkbox" checked={values.agreeTos} onChange={handleChange('agreeTos')} onBlur={() => handleBlur('agreeTos')} />
                                <span>이용약관 동의 <em className={styles.requiredMark}>*</em></span>
                            </label>
                            {hasError('agreeTos') && <div className={styles.msgError}>{errors.agreeTos}</div>}
                            <label className={styles.checkRow}>
                                <input type="checkbox" checked={values.agreePrivacy} onChange={handleChange('agreePrivacy')} onBlur={() => handleBlur('agreePrivacy')} />
                                <span>개인정보 수집 및 이용 동의 <em className={styles.requiredMark}>*</em></span>
                            </label>
                            {hasError('agreePrivacy') && <div className={styles.msgError}>{errors.agreePrivacy}</div>}
                            <label className={styles.checkRow}>
                                <input type="checkbox" checked={values.agreeMarketing} onChange={handleChange('agreeMarketing')} />
                                <span>[선택] 마케팅 수신 동의</span>
                            </label>
                            <button type="button" className={styles.submitBtn} onClick={nextStep}>다음</button>
                        </>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <>
                            <label className={styles.label}>이름</label>
                            <div className={`${styles.field} ${hasError('name') ? styles.fieldError : ''}`}>
                                <HiUser className={styles.iconLeft} />
                                <input type="text" className={styles.input} placeholder="이름을 입력해 주세요" value={values.name} onChange={handleChange('name')} onBlur={() => handleBlur('name')} />
                            </div>
                            {hasError('name') && <div className={styles.msgError}>{errors.name}</div>}

                            <label className={styles.label}>전화번호</label>
                            <div className={`${styles.field} ${hasError('phone') ? styles.fieldError : ''}`}>
                                <HiPhone className={styles.iconLeft} />
                                <input type="tel" className={styles.input} placeholder="01012345678" value={values.phone} onChange={handleChange('phone')} onBlur={() => handleBlur('phone')} />
                            </div>
                            {hasError('phone') && <div className={styles.msgError}>{errors.phone}</div>}

                            <label className={styles.label}>이메일</label>
                            <div className={`${styles.field} ${hasError('email') ? styles.fieldError : ''}`}>
                                <HiMail className={styles.iconLeft} />
                                <input type="email" className={styles.input} placeholder="you@example.com" value={values.email} onChange={handleChange('email')} onBlur={() => handleBlur('email')} />
                            </div>
                            {hasError('email') && <div className={styles.msgError}>{errors.email}</div>}

                            <label className={styles.label}>비밀번호</label>
                            <div className={`${styles.field} ${hasError('password') ? styles.fieldError : ''}`}>
                                <HiLockClosed className={styles.iconLeft} />
                                <input type={showPw ? 'text' : 'password'} className={styles.input} placeholder="비밀번호를 입력해 주세요(8자 이상)" value={values.password} onChange={handleChange('password')} onBlur={() => handleBlur('password')} />
                                <button type="button" className={styles.iconRightBtn} onClick={() => setShowPw((v) => !v)}>{showPw ? <HiEye /> : <HiEyeOff />}</button>
                            </div>
                            {hasError('password') && <div className={styles.msgError}>{errors.password}</div>}

                            <label className={styles.label}>비밀번호 확인</label>
                            <div className={`${styles.field} ${hasError('confirm') ? styles.fieldError : ''}`}>
                                <HiLockClosed className={styles.iconLeft} />
                                <input type={showConfirm ? 'text' : 'password'} className={styles.input} placeholder="비밀번호를 재입력해 주세요" value={values.confirm} onChange={handleChange('confirm')} onBlur={() => handleBlur('confirm')} />
                                <button type="button" className={styles.iconRightBtn} onClick={() => setShowConfirm((v) => !v)}>{showConfirm ? <HiEye /> : <HiEyeOff />}</button>
                            </div>
                            {hasError('confirm') && <div className={styles.msgError}>{errors.confirm}</div>}

                            <button type="submit" className={styles.submitBtn}>가입완료</button>
                        </>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <div className={styles.completeBox}>
                            <h3 className={styles.completeTitle}>회원가입이 완료되었습니다!</h3>
                            <img className={styles.firecrackerImage} src="/icons/firecracker.png" alt="firecracker" />
                            <div className={styles.loginBtnWrapper}>
                                <button
                                    className={styles.loginBtn}
                                    type="button"
                                    onClick={() => navigate('/login')}>
                                    로그인
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
