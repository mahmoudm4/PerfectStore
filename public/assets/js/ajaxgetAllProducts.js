async function getAllproducts(){
    console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
    let res = await fetch("/products/productList.html/1");
    let resJson = await res.json();
    console.log(resJson);
    let data = resJson.data;
    console.log(data);
    if(data.length > 0){
        showRecipes(data);
        //console.log("data is"+data);
    }else{
        console.log("No Data To Display");
    }
}
getAllproducts();
function showRecipes(products){
        let data = ``;
        console.log(products);
        products.forEach(item => {
            data +=`
            <div class="col-xl-4 col-lg-4 col-md-6">
                    <div class="single-product mb-60">
                        <div class="product-img">
                            <img src="${item.productImage}" alt="">
                            <div class="new-product">
                                <span>New</span>
                            </div>
                        </div>
                        <div class="product-caption">
                            <div class="product-ratting">
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star"></i>
                                <i class="far fa-star low-star"></i>
                                <i class="far fa-star low-star"></i>
                            </div>
                            <h4><a href="#">${item.productName}</a></h4>
                            <div class="price">
                                <ul>
                                    <li>$${item.productPrice}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            
            `
        });
        document.getElementById('data').innerHTML = data;
        //getClasses();
}
