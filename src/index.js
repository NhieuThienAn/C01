import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const partData = path.resolve('src/data/post.json');

function stater() {
    
    const data = fs.readFileSync(partData,'utf8');
    
    const posts = JSON.parse(data);
    

    rl.question(
        "1.Hiển thị data dưới dạng bảng \n2.Thêm 1 bài viết mới \n3.Xóa 1 bài viết \n4.Sắp xếp bài viết \n5.Tìm kiếm bài viết \n6.Xem thống kê bài viết \nNhập một số (0 để thoát): "
        , (input) => {
const number = parseInt(input); 
        
        if (number === 0) {
            console.log("Thoát chương trình.");
            rl.close(); 
            return;
        }

        switch (number) {
            case 1:
                ShowDataByTable(posts);
                break;
            case 2:
                addNewData(posts);
                break;
            case 3:
                deleteDataByID(posts);
                break;   
            
            case 4:
                arrangeDataBydate(posts);
                break;
                
            case 5:
                Search(posts);
                break;
            case 6:
                showStatistics(posts);
                break;
            default:
                console.log("Vui lòng nhập đúng số.");
                break;
        }

        stater();
    });
}



function ShowDataByTable(posts) {
    console.log(JSON.stringify(posts,null,2));
}
function addNewData(posts){
    rl.question("Nhập tiêu đè bài viết: ", (title) => {
        rl.question("Nhập nội dung bài viết: ", (content) => {
            rl.question("Nhập topic bài viết: ", (topic) => {
                rl.question("Nhập tác giả bài viết: ", (author) => {
                    rl.question("Nhập ngày đăng bài viết (yyyy-mm-dd): ", (date) => {
                        const newPost = {
                            id: posts.length + 1,
                            title: title,
                            content: content,
                            topic: topic,
                            author: author,
                            date: date
                        };
                        posts.push(newPost);
                        const upData = JSON.stringify(posts, null, 2);
                        fs.writeFileSync(partData, upData);
                        ShowDataByTable(posts);
                        stater();
                    });
                });
            });
        });
    });
    ShowDataByTable(posts);
}
function deleteDataByID(posts) {
    rl.question("Nhập ID bài viết cần xóa: ", (id) => {
        const postIndex = posts.findIndex(post => post.id === parseInt(id));
        if (postIndex > 0) {
            posts.splice(postIndex, 1);
            const upData = JSON.stringify(posts, null, 2);
            fs.writeFileSync(partData, upData);
            ShowDataByTable(posts);
        } else {
            console.log("ID bài viết không tồn tại!");
        }
        stater();
    });
}
function arrangeDataBydate(posts) {
    rl.question("Bạn muốn sắp xếp bài viết \n1.Thấp đến cao \n2.Cao đến thấp: ", (input) => {
        switch (input) {
            case '1':
                posts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case '2':
                posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            default:
                console.log("Vui lòng nhập đúng số.");
                break;
        }
        ShowDataByTable(posts);
        stater();
    }) 
}
function Search(posts) {
    rl.question("Nhập từ khóa bài viết cần tìm: ", (keyword) => {
        const result = posts.filter(post => post.title.includes(keyword));
        if(result.length > 0){
            console.log("Kết quả tìm kiếm: ");
            console.log(JSON.stringify(result, null, 2));
        }else{
            console.log("Không tìm thấy bài viết nào với từ khóa bạn cung cấp!");
        }
        stater();
    })

}
function showStatistics(posts) {
    const totalPosts = posts.length;
    const authorCount = {};
    const topicCount = {};

    posts.forEach(post => {
        authorCount[post.author] = (authorsCount[post.author] || 0) + 1;
        topicCount[post.topic] = (topicsCount[post.topic] || 0) + 1;
    });

    console.log(`Tổng số bài viết: ${totalPosts}`);
    console.log("Số bài viết theo tác giả:");
    console.log(JSON.stringify(authorsCount, null, 2));
    console.log("Số bài viết theo chủ đề:");
    console.log(JSON.stringify(topicsCount, null, 2));
}
stater();