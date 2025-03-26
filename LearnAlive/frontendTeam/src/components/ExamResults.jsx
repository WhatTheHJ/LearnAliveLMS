import PropTypes from 'prop-types';

const ExamResults = ({ isOpen, onClose, examResults = [] }) => {
  if (!isOpen) return null; // isOpen이 false일 때는 모달을 렌더링하지 않음

  return (
    <div>
      <div>
        <h3>📊 학생 시험 결과</h3>
        <table>
          <thead>
            <tr>
              <th>학생 이름</th>
              <th>제출 시간</th>
              <th>점수</th>
            </tr>
          </thead>
          <tbody>
            {examResults.length > 0 ? (
              examResults.map((result) => (
                <tr key={result.studentId}>
                  <td>{result.name}</td>
                  <td>{result.submittedAt?.replace('T', ' ') || '-'}</td>
                  <td>{result.score ?? '미응시'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">📌 응시한 학생이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

// PropTypes 정의
ExamResults.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  examResults: PropTypes.arrayOf(
    PropTypes.shape({
      studentId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      submittedAt: PropTypes.string,
      examTitle: PropTypes.string,
      score: PropTypes.number,
    })
  ).isRequired,
};

export default ExamResults;
