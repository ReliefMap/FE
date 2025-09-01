import { useState } from 'react';
import styles from './mypage.module.scss';
import { FaUserEdit, FaLock, FaSignOutAlt, FaUserTimes, FaSnowflake, FaTint, FaSoap, FaBatteryFull, FaLightbulb } from 'react-icons/fa';
import { MdMedicalServices } from 'react-icons/md';
import { GiMeal, GiFlashlight } from 'react-icons/gi';
import { BiSolidBlanket } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export default function Mypage() {
  const [modalType, setModalType] = useState<null | 'edit' | 'password' | 'logout' | 'withdraw'>(null);

  const [tab, setTab] = useState<'info' | 'reservations' | 'map' | 'account'>('info');
  const navigate = useNavigate();

  const closeModal = () => setModalType(null);

  const getBadgeClass = (status: string) => {
  if (status === '수령 완료') return styles.badgeDone;
  if (status === '수령 대기') return styles.badge;
  return styles.badgeCancel;
};

  const getItemIcon = (item: string) => {
    switch (item) {
      case '구호키트':
        return <MdMedicalServices className={styles.itemIcon} />;
      case '방한용품세트':
        return <FaSnowflake className={styles.itemIcon} />;
      case '식수세트':
        return <FaTint className={styles.itemIcon} />;
      case '식량세트':
        return <GiMeal className={styles.itemIcon} />;
      case '담요세트':
        return <BiSolidBlanket className={styles.itemIcon} />;
      case '위생용품세트':
        return <FaSoap className={styles.itemIcon} />;
      case '랜턴':
        return <GiFlashlight className={styles.itemIcon} />;
      case '파워뱅크':
        return <FaBatteryFull className={styles.itemIcon} />;
      default:
        return <FaLightbulb className={styles.itemIcon} />;
    }
  };
  const [filters, setFilters] = useState({ date: '', item: '', status: '' });

  const reservations = [
    { date: '2025-08-28', item: '구호키트', status: '수령 대기', location: '서울시청', code: 'RSV-001' },
    { date: '2025-08-10', item: '방한용품세트', status: '수령 완료', location: '강남구청', code: 'RSV-002' },
    { date: '2025-07-25', item: '식수세트', status: '예약 취소', location: '마포구청', code: 'RSV-003' },
    { date: '2025-06-15', item: '담요세트', status: '수령 완료', location: '송파구청', code: 'RSV-004' },
    { date: '2025-06-01', item: '식량세트', status: '수령 대기', location: '종로구청', code: 'RSV-005' },
    { date: '2025-05-20', item: '위생용품세트', status: '예약 취소', location: '노원구청', code: 'RSV-006' },
    { date: '2025-05-10', item: '랜턴', status: '수령 대기', location: '성동구청', code: 'RSV-007' },
    { date: '2025-04-15', item: '파워뱅크', status: '수령 완료', location: '도봉구청', code: 'RSV-008' },
    { date: '2025-03-20', item: '식수세트', status: '수령 대기', location: '동작구청', code: 'RSV-009' },
    { date: '2025-03-01', item: '구호키트', status: '수령 완료', location: '중구청', code: 'RSV-010' },
  ];


  const filteredReservations = reservations.filter((r) => {
    return (
      (!filters.date || r.date === filters.date) &&
      (!filters.item || r.item === filters.item) &&
      (!filters.status || r.status === filters.status)
    );
  });

  const resetFilters = () => {
    setFilters({ date: '', item: '', status: '' });
  };

  const [selectedReservation, setSelectedReservation] = useState<null | typeof reservations[0]>(null);
  const closeDetailModal = () => setSelectedReservation(null);


  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>마이페이지</h2>

      <div className={styles.tabs}>
        <button className={tab === 'info' ? styles.active : ''} onClick={() => setTab('info')}>계정 관리</button>
        <button className={tab === 'reservations' ? styles.active : ''} onClick={() => setTab('reservations')}>예약 현황</button>
      </div>

      <div className={styles.card}>
        {tab === 'info' && (
          <>
            <h3 className={styles.sectionTitle}><strong>👤 내 정보</strong></h3>
            <div className={styles.infoBox}>
              <p><strong>이름:</strong> 홍길동</p>
              <p><strong>전화번호:</strong> 010-1234-5678</p>
              <p><strong>이메일:</strong> hong@example.com</p>
            </div>

            <div className={styles.actionGrid}>
              <button className={styles.actionCard} onClick={() => setModalType('edit')}>
                <FaUserEdit size={24} />
                <span>정보 수정</span>
              </button>
              <button className={styles.actionCard} onClick={() => setModalType('password')}>
                <FaLock size={24} />
                <span>비밀번호 변경</span>
              </button>
              <button className={styles.actionCard} onClick={() => setModalType('logout')}>
                <FaSignOutAlt size={24} />
                <span>로그아웃</span>
              </button>
              <button className={`${styles.actionCard} ${styles.danger}`} onClick={() => setModalType('withdraw')}>
                <FaUserTimes size={24} />
                <span>회원 탈퇴</span>
              </button>
            </div>
          </>
        )}

        {tab === 'reservations' && (
          <>
            <h3 className={styles.sectionTitle}><strong>📦 예약 현황</strong></h3>

            {/* 필터 영역 */}
            <div className={styles.filterRow}>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className={styles.filterInput}
              />
              <select
                value={filters.item}
                onChange={(e) => setFilters({ ...filters, item: e.target.value })}
                className={styles.filterInput}
              >
                <option value="">전체 품목</option>
                <option value="구호키트">구호키트</option>
                <option value="방한용품세트">방한용품세트</option>
                <option value="식수세트">식수세트</option>
                <option value="식량세트">식량세트</option>
                <option value="담요세트">담요세트</option>
                <option value="위생용품세트">위생용품세트</option>
                <option value="랜턴">랜턴</option>
                <option value="파워뱅크">파워뱅크</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className={styles.filterInput}
              >
                <option value="">전체 상태</option>
                <option value="예약 취소">예약 취소</option>
                <option value="수령 대기">수령 대기</option>
                <option value="수령 완료">수령 완료</option>
              </select>
              <button className={styles.btn} onClick={resetFilters}>필터 초기화</button>
            </div>

            {/* 카드 목록 */}
            <div className={styles.actionGrid}>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((r, idx) => (
                  <div key={idx} className={styles.actionCard} onClick={() => setSelectedReservation(r)}>
                    <p><strong>{r.date}</strong></p>
                    <div className={styles.itemColumn}>
                      {getItemIcon(r.item)}
                      <span>{r.item}</span>
                    </div>
                    <span className={getBadgeClass(r.status)}>
                      {r.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className={styles.noResult}>일치하는 예약이 없습니다.</p>
              )}
            </div>
          </>
        )}
      </div>

      {modalType && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {{
                edit: '회원 정보 수정',
                password: '비밀번호 변경',
                logout: '로그아웃 하시겠습니까?',
                withdraw: '정말 탈퇴하시겠습니까?',
              }[modalType]}
            </h3>

            <div className={styles.modalContent}>
              {modalType === 'edit' && (
                <>
                  <input type="text" placeholder="이름" className={styles.input} />
                  <input type="tel" placeholder="전화번호" className={styles.input} />
                  <input type="email" placeholder="이메일" className={styles.input} />
                  <button className={styles.confirmBtn}>수정하기</button>
                </>
              )}
              {modalType === 'password' && (
                <>
                  <input type="password" placeholder="현재 비밀번호" className={styles.input} />
                  <input type="password" placeholder="새 비밀번호" className={styles.input} />
                  <input type="password" placeholder="비밀번호 확인" className={styles.input} />
                  <button className={styles.confirmBtn}>변경하기</button>
                </>
              )}
              {modalType === 'logout' && (
                <button className={styles.confirmBtn} onClick={() => {
                  alert('로그아웃되었습니다.');
                  closeModal();
                }}>
                  로그아웃
                </button>
              )}
              {modalType === 'withdraw' && (
                <button className={`${styles.confirmBtn} ${styles.dangerBtn}`} onClick={() => {
                  if (confirm('정말 탈퇴하시겠습니까? 복구할 수 없습니다.')) {
                    alert('탈퇴 완료');
                    closeModal();
                  }
                }}>
                  탈퇴하기
                </button>
              )}
            </div>
            <button className={styles.closeBtn} onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}

      {selectedReservation && (
        <div className={styles.modalOverlay} onClick={closeDetailModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>예약 상세 정보</h3>

            <div className={styles.modalContent}>
              <p><strong>예약일:</strong> {selectedReservation.date}</p>
              <p><strong>물품:</strong> {selectedReservation.item}</p>
              <p><strong>수령 장소:</strong> {selectedReservation.location}</p>

              {/* 지도로 위치 표시 (예: 구글 지도 iframe 등) */}
              <iframe
                className={styles.map}
                src={`https://www.google.com/maps?q=${encodeURIComponent(selectedReservation.location)}&output=embed`}
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: '8px', marginTop: '10px' }}
                loading="lazy"
              ></iframe>

              {/* 예약번호 or QR */}
              <div className={styles.qrSection}>
                <p><strong>예약번호:</strong> {selectedReservation.code}</p>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${selectedReservation.code}&size=100x100`} alt="QR Code" />
              </div>
            </div>

            <button className={styles.closeBtn} onClick={closeDetailModal}>닫기</button>
          </div>
        </div>
      )}

    </div>
  );
}
