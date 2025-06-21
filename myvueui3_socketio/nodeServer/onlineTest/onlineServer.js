
function initDoudizhu(app){

    app.get("/api/online/getXXXX", (req, res) => {
        
        res.json({
            isSuccess: true,
            error: null,
            data: []
        });
    })
}

module.exports = {
    initDoudizhu: initDoudizhu
}