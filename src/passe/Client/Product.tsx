import BrandProduct from '../../components/Client/brandProduct';
import ListProduct from '../../components/Client/listProduct';
import SelectProduct from '../../components/Client/selectProduct';

function Product() {
  return (
    <>
      <section className="flex justify-center items-center bg-[#f2f2f2]">
        <div>
          <div>
            <img
              className="object-cover w-full h-full"
              src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/slider_1.jpg?1719764721426"
              alt=""
            />
          </div>
          <div className="flex justify-center items-center gap-3 mt-[-100px]">
            <div className="rounded-[10px] max-w-[590px] overflow-hidden relative group">
              <img
                className="rounded-[10px] transform scale-100 group-hover:scale-110 transition-transform duration-[2000ms] ease-in-out"
                src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/2banner_1.jpg?1719764721426"
                alt="Banner Image"
              />
            </div>

            <div className="rounded-[10px] max-w-[590px] overflow-hidden relative group">
              <img
                className="rounded-[10px] transform scale-100 group-hover:scale-110 transition-transform duration-[2000ms] ease-in-out"
                src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/2banner_2.jpg?1719764721426"
                alt="Banner Image"
              />
            </div>
          </div>
          <div className=" flex justify-center items-center m-3 ">
            <div className="grid grid-cols-4 gap-4 w-[1200px] shadow-sm shadow-white bg-white rounded-[5px]  border-2 p-2 ">
              {/* Mỗi ô chính sách */}
              {[
                {
                  text: 'Giao hàng nhanh',
                  img: 'https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/chinhsach_1.png?1719764721426',
                },
                {
                  text: 'Tư vấn chuyên nghiệp',
                  img: 'https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/chinhsach_2.png?1719764721426://bizweb.dktcdn.net/100/502/883/themes/934584/assets/chinhsach_1.png?1719764721426',
                },
                {
                  text: '100% chính hãng',
                  img: 'https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/chinhsach_3.png?1719764721426',
                },
                {
                  text: 'Thanh toán linh hoạt',
                  img: 'https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/chinhsach_4.png?1719764721426',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className=" flex items-center justify-center p-3 border-[#000f8f] border-2 rounded-[5px]"
                >
                  <img
                    className="w-[40px] h-[40px] object-contain mr-3"
                    src={item.img}
                    alt="Icon"
                  />
                  <p className="font-semibold text-lg">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="shadow-sm shadow-white bg-white rounded-[5px]  border-2 p-2">
              <div className="my-3">
                <h1 className="text-2xl font-semibold">DANH MỤC NỔI BẬT </h1>
              </div>
              <div className="grid grid-cols-4 gap-[20px] ">
                <BrandProduct categoryId={1} />
                <BrandProduct categoryId={2} />
                <BrandProduct categoryId={3} />
                <BrandProduct categoryId={4} />
              </div>
            </div>
          </div>
          <div className="flex  justify-center items-center my-5">
            <SelectProduct />
          </div>
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="max-w-[240px] p-2 bg-white rounded-[5px]  ">
              <img
                className="w-full mb-12"
                src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/banner1_product1.jpg?1719764721426"
                alt=""
              />
              <img
                className="w-full"
                src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/banner2_product1.jpg?1719764721426"
                alt=""
              />
            </div>
            <div>
              <ListProduct categoryId={1} />
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mb-6">
            <div>
              <ListProduct categoryId={2} />
            </div>
            <div className="max-w-[240px] p-2 bg-white rounded-[5px]  ">
              <img
                className="w-full mb-12"
                src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/banner1_product2.jpg?1719764721426"
                alt=""
              />
              <img
                className="w-full"
                src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/banner2_product2.jpg?1719764721426"
                alt=""
              />
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="max-w-[240px] p-2 bg-white rounded-[5px]  ">
              <img
                className="w-full mb-12"
                src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/banner1_product3.jpg?1719764721426"
                alt=""
              />
              <img
                className="w-full"
                src="https://bizweb.dktcdn.net/100/502/883/themes/934584/assets/banner2_product3.jpg?1719764721426"
                alt=""
              />
            </div>
            <div>
              <ListProduct categoryId={3} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Product;
