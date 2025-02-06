

// 피드 생성 모달을 전역관리
let $modal = document.getElementById("createPostModal");

// 모달 관련 dom 들을 저장할 객체
let elements = {
    $closeBtn: $modal.querySelector('.modal-close-button'),
    $backdrop: $modal.querySelector('.modal-backdrop'),
    $uploadBtn: $modal.querySelector('.upload-button'),
    $fileInput: $modal.querySelector('#fileInput'),
}

// 파일 업로드 관련 이벤트 함수
function setUpFileUploadEvents () {

    const {$uploadBtn, $fileInput} = elements;

    // 업로드 버튼을 누르면 파일 선택창이 대신 눌리도록 조작
    $uploadBtn.addEventListener('click', e => {
        $fileInput.click();
    });

}

// 피드 생성 모달 관련 이벤트 함수
function setUpModalEvents () {

    const {$closeBtn, $backdrop} = elements;

    // 모달 열기
    const openModal = e => {
        e.preventDefault();

        $modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 모달 출력시 배경 바디 스크롤 방지
    }

    const closeModal = e => {
        e.preventDefault();

        $modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 모달 닫을시 배경 바디 스크롤 방지 해제
    }

    // 피드 생성 모달 열기 이벤트
    document.querySelector('.fa-square-plus')
        .closest('.menu-item')
        .addEventListener('click', openModal);

    // 피드 생성 모달 닫기 이벤트 - X 버튼 눌렀을때
    $closeBtn.addEventListener('click', closeModal);

    // 피드 생성 모달 닫기 이벤트 - 백드롭을 눌렀을때
    $backdrop.addEventListener('click', closeModal);
}

// 이벤트 바인딩 관련 함수
function bindEvents () {
    setUpModalEvents();
    setUpFileUploadEvents();
}

// 모달 관련 JS 함수 - 외부에 노출
function initCreateFeedModal () {
    bindEvents();
}

export default initCreateFeedModal;