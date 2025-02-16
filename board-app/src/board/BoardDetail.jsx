import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BoardDetail() {

    const [board, setBoard] = useState({});
    const {boardIdx} = useParams();

    /* 제목 및 내용 수정 기능 */
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');

    /* 게시판 상세 조회 결과를 반영 */
    useEffect(() => {

        const token = sessionStorage.getItem("token");

        axios
            .get(`http://localhost:8080/api/v2/board/${boardIdx}`, {headers: {"Authorization": `Bearer ${token}`}})
            .then(res => {
                res && res.data && setBoard(res.data)
                res && res.data && setTitle(res.data.title);
                res && res.data && setContents(res.data.contents);
            })
            .catch(err => {
                console.log(err);
                if (err.status === 401 || err.status === 403) {
                    alert("인증 토큰 누락 또는 오류");
                    navigate("/");
                }
            });
    }, []);

    /* 버튼 기능 구현 */
    const navigate = useNavigate();

    const listButtonClick = e => {
        e.preventDefault();
        navigate("/list");
    };

    const updateButtonClick = e => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        axios
            .put(`http://localhost:8080/api/v2/board/${boardIdx}`,{title, contents}, {headers: {"Authorization": `Bearer ${token}`}})
            .then(res => res && res.status === 200 && navigate("/list"))
            .catch(err => console.log(err));
    };

    const deleteButtonClick = e => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        axios
            .delete(`http://localhost:8080/api/v2/board/${boardIdx}`, {headers: {"Authorization": `Bearer ${token}`}})
            .then(res => res && res.status === 200 && navigate("/list"))
            .catch(err => console.log(err));
    };

    /* 첨부파일 다운로드 기능 */
    const fileDownload = (e, file) => {
        e.preventDefault();

        const {idx, originalFileName} = file;
        const token = sessionStorage.getItem("token");

        axios({
            url: `http://localhost:8080/api/v2/board/file?boardIdx=${boardIdx}&idx=${idx}`,
            method: 'GET',
            responseType: 'blob',
            headers: {"Authorization": `Bearer ${token}`}        
        })
        .then(res => {
            const href = URL.createObjectURL(res.data);

            const link = document.createElement('a');
            link.href = href;
            link.setAttribute("download", originalFileName);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        })
    };

    /* 리턴 함수 */
    return (
        <>
            <div className="container">
                <h2>게시판 상세</h2>
                <form id="frm" method="post">
                    <input type="hidden" name="boardIdx" value={board.boardIdx} />
                    
                    <table className="board_detail">
                        <colgroup>
                            <col width="15%" />
                            <col width="*" />
                            <col width="15%" />
                            <col width="35%" />                    
                        </colgroup>
                        <tbody>
                        <tr>
                            <th>글번호</th>
                            <td>{board.boardIdx}</td>
                            <th>조회수</th>
                            <td>{board.hitCnt}</td>
                        </tr>
                        <tr>
                            <th>작성자</th>
                            <td>{board.createdId}</td>
                            <th>작성일</th>
                            <td>{board.createdDt}</td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td colSpan="3"><input type="text" id="title" name="title" value={title} onChange={e => setTitle(e.target.value)} /></td>
                        </tr>
                        <tr>
                        <td colSpan="4"><textarea id="contents" name="contents" value={contents} onChange={e => setContents(e.target.value)}></textarea></td>                
                        </tr>
                        </tbody>
                    </table>
                </form>
                
                <div className="file_list">
                    {/* <a></a> */}
                    {
                        board.fileInfoList && board.fileInfoList.map((file, index) =>
                        (<p key={index}>
                            <a onClick={e => fileDownload(e, file)}>
                                {file.originalFileName} ({file.fileSize}kb)
                            </a>
                        </p>))
                    }
                </div>
                
                {/* 버튼 동작은 이벤트 핸들러로 대체 */}
                <input type="button" id="list" className="btn" value="목록으로" onClick={listButtonClick} />
                <input type="button" id="update" className="btn" value="수정하기" onClick={updateButtonClick} />
                <input type="button" id="delete" className="btn" value="삭제하기" onClick={deleteButtonClick} />
                
            </div>
        </>
    );
}