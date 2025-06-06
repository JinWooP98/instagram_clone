
import CarouselManager from "../ui/CarouselManager.js";

// step 모듈내에서 전역관리
let currentStep = 1;

let step2Carousel = null;
let step3Carousel = null;

// 선택한 이미지 파일들을 전역관리
let selectedFiles = null;

// 피드 생성 모달을 전역관리
let $modal = document.getElementById("createPostModal");

// 모달 관련 dom 들을 저장할 객체
let elements = {
    $closeBtn: $modal.querySelector('.modal-close-button'),
    $backdrop: $modal.querySelector('.modal-backdrop'),
    $uploadBtn: $modal.querySelector('.upload-button'),
    $fileInput: $modal.querySelector('#fileInput'),
    $backStepBtn: $modal.querySelector('.back-button'),
    $nextStepBtn: $modal.querySelector('.next-button'),
    $modalTitle: $modal.querySelector('.modal-title'),
    $uploadArea: $modal.querySelector('.upload-area'), // 드래그 영역
    $contentTextarea: $modal.querySelector('.content-input textarea'),
    $charCounter: $modal.querySelector('.char-counter'),
    $nestedModal: $modal.querySelector('.nested-modal'),
    $deleteBtn: $modal.querySelector('.delete-button'),
    $cancelBtn: $modal.querySelector('.cancel-button'),
    $loadingSpinner: $modal.querySelector('.loading-spinner'),
};

// 로딩 스피너 처리
function setLoading(loading = false) {
    const {$loadingSpinner, $backStepBtn, $nextStepBtn} = elements;

    $loadingSpinner.style.display = loading ? 'block' : 'none';

    $nextStepBtn.style.display = loading ? 'none' : 'block';

    $backStepBtn.style.visibility = loading ? 'hidden' : 'visible';

    $nextStepBtn.disabled = loading;

}

// API 서버에 피드의 내용과 이미지들을 전송
function fetchFeed() {
    if(currentStep !== 3) return;

    const {$contentTextarea} = elements;

    // 작성자이름과 피드 내용을 전송
    const feedData = {
        writer: '임시사용자', // 차후에 인증이 만들어진 후 변경
        content: $contentTextarea.value.trim(), // trim은 앞뒤 공백 제거
    };


    // JSON과 이미지를 같이 전송하려면 form-data가 필요함
    const formData = new FormData();

    formData.append("feed", new Blob([JSON.stringify(feedData)], {type: 'application/json'})); // JSON 넣기

    selectedFiles.forEach(file => {
        formData.append("images", file)
    });

    setLoading(true); // 로딩 상태 활성화

    setTimeout(async () => {
        // 서버에 POST요청 전송
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if(response.ok) {
            window.location.reload(); // 피드 새로고침
        } else {
            console.error('fail to request');
            alert(data.message);
        }
    }, 1500);

}

// 모달 바디 스텝을 이동하는 함수
function goToStep(step) {

    if(step < 1 || step > 3) return;

    currentStep = step;

    const {$backStepBtn, $nextStepBtn, $modalTitle, $fileInput} = elements;

    // 기존 스텝 컨테이너의 active를 제거하고 해당 step컨테이너에 active부여
    [...$modal.querySelectorAll('.step')].forEach(($stepContainer, index) => {
        // // 기존 class active remove
        // if ($stepContainer.classList.contains('active')) {
        //     $stepContainer.classList.remove('active');
        // }
        // // 다음 step active add
        // if(step === index + 1) {
        //     $stepContainer.classList.add('active');
        // }

        //toggle은 첫번째 파라미터의 클래스가 존재하면 없애고 존재하지 않으면 붙여주는 기능을 함
        // 두번째 파라미터는 true / false 여부에 따라 클래스를 붙여줄지 안붙여줄지 정해주는 기능이다.
        $stepContainer.classList.toggle('active', step === index + 1);
    });

    if(step === 1) {
        $fileInput.value = ''; // 다음번 change이벤트 발동을 위한 리셋
        $nextStepBtn.style.display = 'none';
        $backStepBtn.style.display = 'hidden';
        $modalTitle.textContent = '새 게시물 만들기';
    } else if (step === 2) {
        $nextStepBtn.style.display = 'block';
        $backStepBtn.style.visibility = 'visible';
        $modalTitle.textContent = '편집';
        $nextStepBtn.textContent = '다음';
    } else if (step === 3) {
        $nextStepBtn.textContent = '공유하기';
        $modalTitle.textContent = '새 게시물 만들기';
    }
}

// 파일을 검사하는 함수
const validateFiles = files => {
    return files.filter(file => {
        if(!file.type.startsWith('image')) {
            alert(`${file.name}은(는) 이미지가 아닙니다.`);
            return false;
        }
        return true;
    }).filter(file => {
        if(file.size > 10 * 1024 * 1024) {
            alert(`${file.name}은(는) 10MB를 초과합니다.`);
            return false;
        }
        return true;
    });
}

// 파일 업로드 관련 이벤트 함수
function setUpFileUploadEvents () {

    const {$uploadBtn, $fileInput, $uploadArea} = elements;

    // 파일을 검사하고 다음 단계로 이동하는 함수
    const handleFiles = files => {
        // 파일의 개수가 10개가 넘는지 검사
        if(files.length > 10) {
            alert('최대 10개의 파일만 선택 가능합니다.');
            return;
        }

        // // 파일이 이미지인지 확인
        // // 이미지이고 크기가 10MB 이하인 파일들만 validFiles 에 저장
        const validFiles = validateFiles(files);

        // 서버전송을 위해 전역변수에 저장
        selectedFiles = validFiles;

        // 이미 생성되어있다면, 그냥 init()만 다시 호출해서 '슬라이드 목록'만 업데이트
        if(step2Carousel && step3Carousel) {
            step2Carousel.init(validFiles);
            step3Carousel.init(validFiles);
        } else {
            // 이미지 슬라이드 생성
            step2Carousel = new CarouselManager($modal.querySelector('.preview-container'));
            step3Carousel = new CarouselManager($modal.querySelector('.write-container'));

            step2Carousel.init(validFiles);
            step3Carousel.init(validFiles);
        }

        // 모달 step 2로 이동
        goToStep(2);

    }

    // 업로드 버튼을 누르면 파일 선택창이 대신 눌리도록 조작
    $uploadBtn.addEventListener('click', e => {
        e.preventDefault();
        $fileInput.click();
    });

    // 파일 선택이 끝났을 때 파일정보를 읽는 이벤트
    $fileInput.addEventListener('change', e => {
        e.preventDefault();
        const files = [...e.target.files];

        if(files.length > 0) {
            handleFiles(files);
        }

    });

    // 파일 드래그& 드롭 이벤트
    // 드래그 영역에 진입했을 때
    $uploadArea.addEventListener('dragover', e => {
        e.preventDefault();
        $uploadArea.classList.add('dragover');
    });
    // 드래그 영역에서 나갔을 때
    $uploadArea.addEventListener('dragleave', e => {
        e.preventDefault();
        $uploadArea.classList.remove('dragover');
    });
    // 드래그 영역에 드롭했을 때
    $uploadArea.addEventListener('drop', e => {
       e.preventDefault(); // 드롭했을 때 이미지 새탭이 열리거나 파일이 다운로드되는 것을 방지

        // 파일 정보 얻어오기
        const files = [...e.dataTransfer.files];
        if(files.length > 0) handleFiles(files);
    });
}

// 피드 생성 모달 관련 이벤트 함수
function setUpModalEvents () {

    const {$closeBtn, $backdrop, $backStepBtn, $nextStepBtn, $nestedModal} = elements;

    // 모달 열기
    const openModal = e => {
        e.preventDefault();

        $modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 모달 출력시 배경 바디 스크롤 방지
    }

    const closeModal = e => {
        e.preventDefault();

        // step2 부터는 모달을 닫으면 안됨. 대신 새로운 모달을 띄워야 함
        if(currentStep >= 2) {
            // 중첩 모달 띄우기
            $nestedModal.style.display = 'flex';
            return;
        }

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

    // 모달 이전, 다음 스텝 클릭이벤트
    // 이전 버튼
    $backStepBtn.addEventListener('click', () => goToStep(currentStep - 1));
    // 다음 버튼
    $nextStepBtn.addEventListener('click', () => {
        if(currentStep < 3) {
            goToStep(currentStep + 1)
        } else {
            fetchFeed(); // 서버에 요청 전송
        }
    });
}

// 피드 내용 입력 이벤트
function setUpTextareaEvents() {

    const {$contentTextarea, $charCounter} = elements;

    $contentTextarea.addEventListener('input', () => {
        const length = $contentTextarea.value.length;
        $charCounter.textContent = `${length.toString()} / 2,200`;

        if (length > 2200) {
            $charCounter.classList.add('exceed');
            $contentTextarea.value = $contentTextarea.value.slice(0, 2200);
        } else {
            $charCounter.classList.remove('exceed');
        }
    });

}

// 피드 모달 닫을 때 삭제 취소 관련
function setUpNestedModalEvents() {
    const {$nestedModal, $deleteBtn, $cancelBtn} = elements;

    // 취소처리 - 중첩모달만 닫기
    $cancelBtn.addEventListener('click', () => {
        $nestedModal.style.display = 'none';
    });

    // 삭제처리 - 모든 모달을 닫고 초기상태로 귀한
    $deleteBtn.addEventListener('click', () => {
        // 새로고침시 모든것이 초기로 돌아감
        window.location.reload();
    })
}

// 이벤트 바인딩 관련 함수
function bindEvents () {
    setUpModalEvents(); // 모달 관련 이벤트
    setUpFileUploadEvents(); // 파일 업로드 관련 이벤트
    setUpTextareaEvents(); // 텍스트 관련 이벤트
    setUpNestedModalEvents(); // 중첩 모달 관련 이벤트
}

// 모달 관련 JS 함수 - 외부에 노출
function initCreateFeedModal () {
    bindEvents();
}

export default initCreateFeedModal;