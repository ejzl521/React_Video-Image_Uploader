import {useState} from 'react';
import "./uploader.scss";
import {Button} from "@mui/material";

const Uploader = () => {

  const [file, setFile] = useState({
    fileObject: "",
    preview_URL: "img/default_image.png",
    type: "image"
  });

  let inputRef;

  const saveImage = (e) => {
    e.preventDefault();
    // 미리보기 url 만들기
    const fileReader = new FileReader();
    // 파일이 존재하면 file 읽기
    if (e.target.files[0]) {
      fileReader.readAsDataURL(e.target.files[0])
    }
    // 읽기 동작이 성공적으로 완료되었을 때
    fileReader.onload = () => {
      const fileType = e.target.files[0].type.split("/")[0]

      // video일 때 시간 제한 15초
      if (fileType === "video") {
        let videoElement = document.createElement("video");
        videoElement.src = fileReader.result
        /*
          video 길이 제한!
          videoElement의 readyState가 4면 비디오가 로딩이 된 것이므로 길이를 판별할 수 있다
          video가 재생할 수 있는 상태로 만드는 과정이 비동기적으로 실행되기 때문에
          setInterval로 비디오가 로딩된 상태가 될 때까지 계속 확인하면서 기다려준다
        */
        const timer = setInterval(() => {
          if (videoElement.readyState == 4) {
            if (videoElement.duration > 16) {
              alert("동영상의 길이가 16초보다 길면 안됩니다")
            } else {
              setFile(
                {
                  fileObject: e.target.files[0],
                  preview_URL: fileReader.result,
                  type: fileType
                }
              )
            }
            clearInterval(timer);
          }
        }, 500);
      } else { // image일 땐 시간제한이 없으므로 그냥 상태에 넣어줌
        setFile(
          {
            fileObject: e.target.files[0],
            preview_URL: fileReader.result,
            type: fileType
          }
        )
      }
    }
  }
  //  상태 초기화하기
  const deleteImage = () => {
    setFile({
      fileObject: "",
      preview_URL: "img/default_image.png",
      type: "image"
    });
  }

  return (
    <div className="uploader-wrapper">
      <input
        type="file" accept="video/*, image/*"
        onChange={saveImage}
        // 클릭할 때 마다 file input의 value를 초기화 하지 않으면 버그가 발생할 수 있다
        // 사진 등록을 두개 띄우고 첫번째에 사진을 올리고 지우고 두번째에 같은 사진을 올리면 그 값이 남아있음!
        onClick={(e) => e.target.value = null}
        ref={refParam => inputRef = refParam}
        style={{display: "none"}}
      />
      <div className="file-wrapper">
        {file.type === "image" ?
          <img src={file.preview_URL}/> :
          <video controls={true} autoPlay={true} src={file.preview_URL}/>
        }
      </div>
      <div className="upload-button">
        <Button variant="contained" onClick={() => inputRef.click()}>
          Preview
        </Button>
        <Button variant="contained" color="error" onClick={deleteImage}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default Uploader;