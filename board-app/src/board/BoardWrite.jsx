import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function BoardWrite() {

    /* 제목 및 내용을 상태변수로 관리 */
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');

    const changeTitle = e => setTitle(e.target.value);
    const changeContents = e => setContents(e.target.value);

    /* 첨부파일을 상태변수로 관리 */
    const refFiles = useRef();

    const [files, setFiles] = useState([]);
    const changeFiles = e => {
        const files = e.target.files;

        if (files.length > 3) {
            alert("이미지는 최대 3개까지만 업로드 가능합니다.");
            refFiles.current.value = "";
            setFiles([]);
            return;
        }

        setFiles([...files]);
    };

    /* 폼 데이터를 서버로 전달하는 기능 */
    const formData = new FormData();

    const data = { title, contents };
    formData.append("board", JSON.stringify(data));

    Object.values(files).forEach(file => formData.append("files", file));

    // 업로드 성공 후 목록 화면으로 이동
    const navigate = useNavigate();

    const handlerSubmit = e => {
        e.preventDefault();
        axios({
            method: "POST",
            url: "http://localhost:8080/api/board", 
            data: formData, 
            headers: {"Content-Type": "multipart/form-data"}
        })
        .then(res => res && res.status === 200 && navigate("/list"))
        .catch(err => console.log(err));
    };

    /* 리턴 함수 */
    return (
        <>
            <div className="container">
                <h2>게시판 등록</h2>
                <form id="frm" onSubmit={handlerSubmit}>
                    <table className="board_detail">
                        <tbody>
                        <tr>
                        <td>제목</td>
                        <td><input type="text" id="title" name="title" value={title} onChange={changeTitle} /></td>
                        </tr>
                        <tr>
                        <td colSpan="2"><textarea id="contents" name="contents" value={contents} onChange={changeContents} ></textarea></td>	               
                        </tr>
                        </tbody>
                    </table>
                    <input ref={refFiles} onChange={changeFiles} type="file" id="files" name="files" multiple="multiple" />
                    <input type="submit" id="submit" value="저장" className="btn" />
                </form>
            </div>
        </>
    );
}
