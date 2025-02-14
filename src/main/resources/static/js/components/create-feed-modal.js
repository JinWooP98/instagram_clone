

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
}

// 모달 바디 스텝을 이동하는 함수
function goToStep(step) {

    const {$backStepBtn, $nextStepBtn, $modalTitle} = elements;

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

// 파일 업로드 관련 이벤트 함수
function setUpFileUploadEvents () {

    const {$uploadBtn, $fileInput} = elements;

    // 파일을 검사하고 다음 단계로 이동하는 함수
    const handleFiles = files => {
        // 파일의 개수가 10개가 넘는지 검사
        if(files.length > 10) {
            alert('최대 10개의 파일만 선택 가능합니다.');
            return;
        }

        // 파일이 이미지인지 확인
        // 이미지이고 크기가 10MB 이하인 파일들만 validFiles 에 저장
        const validFiles = files.filter(file => {
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
        })

        // 모달 step 2로 이동
        goToStep(2);

    }

    // 업로드 버튼을 누르면 파일 선택창이 대신 눌리도록 조작
    $uploadBtn.addEventListener('click', e => {
        $fileInput.click();
    });

    // 파일 선택이 끝났을 때 파일정보를 읽는 이벤트
    $fileInput.addEventListener('change', e => {
        const files = [...e.target.files];

        if(files.length > 0) {
            handleFiles(files);
        }

    })
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