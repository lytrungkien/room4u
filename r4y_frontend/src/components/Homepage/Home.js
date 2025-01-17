import React, { useEffect, useState } from "react";
import axios from "axios";
import CarouselTop from "./components/CarouselTop";
import Item from "./components/Item";
import styles from "./Home.module.css";
import { Input, Checkbox, Radio, InputNumber, Button, Row, Col, Spin } from "antd";
import filter from "../../img/filter.png";
import item1 from "../../img/item1.jpg";
import item2 from "../../img/item2.jpg";
import img from "../../img/img.jpg";
import img1 from "../../img/img1.jpg";
import img2 from "../../img/img2.jpg";
import img3 from "../../img/img3.jpg";
import { Link, useHistory } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { getData, getSearchResult } from '../../actions/homepage';
import { estate } from "../../constants/ActionType";
import { useStore } from 'react-redux';

import { saveState } from '../../localStorage';

import Loading from "../loading";
import Header from "../Header/Header";

const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const store = useStore();

  const data = useSelector(state => state.homepage.list);
  const searchResult = useSelector(state => state.homepage.searchResult);

  const [dataPhongTroSV, setDataPhongTroSV] = useState([]);
  const [dataChungCu, setDataChungCu] = useState([]);
  const [dataVanPhong, setDataVanPhong] = useState([]);
  const [dataNhaNguyenCan, setDataNhaNguyenCan] = useState([]);
  console.log("data search result", searchResult);

  const [estateType, setEstateType] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState("");
  const [disData, setDisData] = useState("");
  const [loading, setLoading] = useState(true);

  store.subscribe(() => {
    saveState(store.getState().auth);
  });

  useEffect(() => {
    history.listen(() => {
      window.scrollTo(0, 0);
  });
    (async () => {
      try {
        const res = await axios.get("http://localhost:3001/getDistricts");
        console.log("res", res);
        if (res.status == 200) {
          const temp = await res.data.filter((item, ind) => item.type == "Quận");
          setDisData(temp);
          // setLoading(false);
        }

      } catch (err) {
        console.log(err);
      }
    })();
    setTimeout(() => window.localStorage.removeItem('userData'), 1200000);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:3001/home");
        if (res.status == 200) {
          console.log("res", res.data.posts);
          await dispatch(getData(res.data.posts));
          await setDataPhongTroSV(res.data.posts[0]);
          await setDataNhaNguyenCan(res.data.posts[1]);
          await setDataVanPhong(res.data.posts[2]);
          await setDataChungCu(res.data.posts[3]);
          setLoading(false);
        } else {
          console.log("res", res);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [getData]);

  const chooseDistrict = (checkedValues) => {
    console.log("select checked = ", checkedValues);
    setDistrict(checkedValues);
  };

  const chooseArea = (e) => {
    console.log("radio checked", e.target.value);
    // const area = [...area];
    // area = area.push(e.target.value);
    setArea(e.target.value);
  };

  const chooseEstate = (e) => {
    console.log("radio checked", e.target.value);
    setEstateType(e.target.value);
  };

  const onChangeMinPrice = (value) => {
    console.log("minPrice", value);
    setMinPrice(value);
  };

  const onChangeMaxPrice = (value) => {
    console.log("maxPrice", value);
    setMaxPrice(value);
  };

  const onFilter = async () => {
    const values = {
      district: district,
      area: area,
      minPrice: minPrice,
      maxPrice: maxPrice,
      estatetype: estateType,
    };

    console.log(values);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/search", {
        district: district,
        area: area,
        minPrice: minPrice,
        maxPrice: maxPrice,
        estatetype: estateType,
      });

      if (response.status == 200) {
        let data = await response.data.posts;
        await dispatch(getSearchResult(data));
        setLoading(false);
        history.push(`/search?estatetype=${estateType}district=${district}&area=${area}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
      }
    } catch (error) {
      console.error("err", error);
    }

  };

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        {/* <div className={styles.search}>
                    <Input.Search
                        placeholder="Tìm kiếm phòng bạn muốn..."
                        allowClear
                        // onSearch={onSearch}
                        className={styles.inputSearch}
                        size="large"
                    />
                </div> */}
        <CarouselTop />
        {loading && <Loading />}

        {!loading && <div className={styles.body}>
          <div className={styles.leftCard}>
            <div className={styles.leftTitle}>
              <img
                src={filter}
                alt="filter"
                width={24}
                style={{ marginRight: "10px" }}
              />
              BỘ LỌC TÌM KIẾM
            </div>
            <div className={styles.leftSubtitle}>Loại BĐS:</div>
            <div>
              <div className={styles.radioGroup}>
                <Radio.Group onChange={chooseEstate} value={estateType}>
                  <Radio className={styles.radioStyle} value={0}>
                    Phòng trọ SV
                  </Radio>
                  <Radio className={styles.radioStyle} value={1}>
                    Nhà nguyên căn
                  </Radio>
                  <Radio className={styles.radioStyle} value={2}>
                    Văn phòng - Mặt bằng KD
                  </Radio>
                  <Radio className={styles.radioStyle} value={3}>
                    Chung cư
                  </Radio>
                </Radio.Group>
              </div>
            </div>
            <div className={styles.borderFilter}></div>
            <div className={styles.leftSubtitle}>Khu vực</div>
            <div>
              <Checkbox.Group
                onChange={chooseDistrict}
                className={styles.checkedboxGroup}
              >
                {
                  disData && disData.map((item, ind) => (
                    <div key={ind}>
                      <Checkbox className={styles.checkedboxStyle} value={item.districtid} >
                        {item.name}
                      </Checkbox>
                    </div>
                  ))
                }
              </Checkbox.Group>
            </div>
            <div className={styles.borderFilter}></div>
            <div className={styles.leftSubtitle}>Diện tích</div>
            <div className={styles.radioGroup}>
              <Radio.Group onChange={chooseArea} value={area}>
                <Radio className={styles.radioStyle} value={0}>
                  {"< 20m"}
                  <sup>2</sup>
                </Radio>
                <Radio className={styles.radioStyle} value={1}>
                  20m<sup>2</sup> - 50m<sup>2</sup>
                </Radio>
                <Radio className={styles.radioStyle} value={2}>
                  50m<sup>2</sup> - 100m<sup>2</sup>
                </Radio>
                <Radio className={styles.radioStyle} value={3}>
                  100m<sup>2</sup> - 200m<sup>2</sup>
                </Radio>
                <Radio className={styles.radioStyle} value={4}>
                  {"> 200m"}
                  <sup>2</sup>
                </Radio>
              </Radio.Group>
            </div>
            <div className={styles.borderFilter}></div>
            <div className={styles.leftSubtitle}>Khoảng giá</div>
            <div className={styles.price}>
              <InputNumber
                size="large"
                defaultValue={0}
                onChange={onChangeMinPrice}
                style={{ marginRight: "10px" }}
              />
              {" - "}
              <InputNumber
                size="large"
                defaultValue={0}
                onChange={onChangeMaxPrice}
                style={{ marginLeft: "10px" }}
              />
            </div>
            <div className={styles.btnApply}>
              <Button className={styles.button} onClick={onFilter}>
                ÁP DỤNG
              </Button>
            </div>
          </div>

          <div className={styles.rightCard}>
            <div className={styles.subGroup}>
              <div className={styles.rightTitle}>
                <Link to="/phong-tro-sv">PHÒNG TRỌ SINH VIÊN</Link>
              </div>
              <Row gutter={[32, 32]}>
                {dataPhongTroSV && dataPhongTroSV.slice(0, 3).map((item, idx) => (
                  <Col xs={24} sm={24} md={8} lg={8} key={idx}>
                    <Link to={`/phong-tro-sv/${item.data.postid}`}>
                      <Item
                        img={item.images ? item.images[0] : ""}
                        type={estate[item.data.estatetype]}
                        title={item.data.title}
                        location={`${item.data.address} - ${item.data.ward} - ${item.data.city}`}
                        rating={4.5}
                        price={item.data.price}
                        square={item.data.area}
                        count_room={item.data.roomnum}
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
              <div className={styles.seeMore}>
                <i>
                  <Link to="/phong-tro-sv">Xem thêm</Link>
                </i>
              </div>
            </div>
            <div className={styles.borderFilter}></div>

            <div className={styles.subGroup}>
              <div className={styles.rightTitle}>
                <Link to="/chung-cu">CHUNG CƯ</Link>
              </div>
              <Row gutter={[32, 32]}>
                {dataChungCu && dataChungCu.slice(0, 3).map((item, idx) => (
                  <Col xs={24} sm={24} md={8} lg={8} key={idx}>
                    <Link to={`/chung-cu/${item.data.postid}`}>
                      <Item
                        img={item.images ? item.images[0] : ""}
                        type={estate[item.data.estatetype]}
                        title={item.data.title}
                        location={`${item.data.address} - ${item.data.ward} - ${item.data.city}`}
                        rating={4.5}
                        price={item.data.price}
                        square={item.data.area}
                        count_room={item.data.room_num}
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
              <div className={styles.seeMore}>
                <i>
                  <Link to="/chung-cu">Xem thêm</Link>
                </i>
              </div>
            </div>
            <div className={styles.borderFilter}></div>

            <div className={styles.subGroup}>
              <div className={styles.rightTitle}>
                <Link to="/chung-cu-mini">VĂN PHÒNG - MẶT BẰNG KINH DOANH</Link>
              </div>
              <Row gutter={[32, 32]}>
                {dataVanPhong && dataVanPhong.slice(0, 3).map((item, idx) => (
                  <Col xs={24} sm={24} md={8} lg={8} key={idx}>
                    <Link to={`/chung-cu-mini/${item.data.postid}`}>
                      <Item
                        img={item.images[0]}
                        type={estate[item.data.estatetype]}
                        title={item.data.title}
                        location={`${item.data.address} - ${item.data.ward} - ${item.data.city}`}
                        rating={4.5}
                        price={item.data.price}
                        square={item.data.area}
                        count_room={item.data.room_num}
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
              <div className={styles.seeMore}>
                <i>
                  <Link to="/chung-cu-mini">Xem thêm</Link>
                </i>
              </div>
            </div>
            <div className={styles.borderFilter}></div>

            <div className={styles.subGroup}>
              <div className={styles.rightTitle}>
                <Link to="/nha-nguyen-can">NHÀ NGUYÊN CĂN</Link>
              </div>
              <Row gutter={[32, 32]}>
                {dataNhaNguyenCan && dataNhaNguyenCan.slice(0, 3).map((item, idx) => (
                  <Col xs={24} sm={24} md={8} lg={8} key={idx}>
                    <Link to={`/nha-nguyen-can/${item.data.postid}`}>
                      <Item
                        img={item.images[0]}
                        type={estate[item.data.estatetype]}
                        title={item.data.title}
                        location={`${item.data.address} - ${item.data.ward} - ${item.data.city}`}
                        rating={4.5}
                        price={item.data.price}
                        square={item.data.area}
                        count_room={item.data.room_num}
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
              <div className={styles.seeMore}>
                <i>
                  <Link to="/nha-nguyen-can">Xem thêm</Link>
                </i>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  );
};

export default Home;
