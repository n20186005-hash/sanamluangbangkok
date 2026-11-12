type Lang = 'th' | 'en' | 'zh';
type L = Record<Lang, string>;
const l = (th:string,en:string,zh:string):L => ({th,en,zh});

/** Destinations actually named by the homepage's general walking routes. */
export const routeDestinations = {
  'sanam-chai-mrt': {
    name:l('สถานี MRT สนามไชย','Sanam Chai MRT Station','Sanam Chai 地铁站'),
    about:l('สถานีรถไฟฟ้าสายสีน้ำเงินในเขตเมืองเก่า มีโถงตกแต่งตามแรงบันดาลใจจากสถาปัตยกรรมไทย และเป็นจุดเริ่มเดินเที่ยววัดโพธิ์กับมิวเซียมสยาม','This Blue Line station connects the southern Rattanakosin quarter with the metro network. Its grand, heritage-inspired concourse is a landmark in its own right.','蓝线 Sanam Chai 站位于老城南部，站厅借鉴传统泰式宫廷建筑元素，是前往卧佛寺和暹罗博物馆的交通节点。'),
    see:l('สังเกตเสา ฝ้าเพดาน และป้ายทางออก ก่อนเลือกทางเท้าไปยังสถานที่ถัดไป','Notice the columns, ceiling patterns and exit signs; the station is south of Sanam Luang, not directly beside the field.','观察立柱、天花和出口标识；本站不紧贴皇家田广场，从车站前往广场仍需沿老城区道路步行。'),
    visit:l('ตรวจทางออกที่เปิดใช้และป้ายรถสายสีน้ำเงิน เผื่อเวลาเดินต่อในอากาศร้อน','Check the operating exits and Blue Line direction. Allow a separate walk toward the palace district, especially in hot weather.','先确认开放出入口及蓝线方向，前往王宫区域需另留步行时间，天气炎热时注意补水。'),
  },
  'tha-chang-pier': {
    name:l('ท่าช้าง','Tha Chang Pier','大象码头'),
    about:l('ท่าเรือโดยสารริมเจ้าพระยาทางตะวันตกของพระบรมมหาราชวัง เป็นทางเข้าย่านเมืองเก่าสำหรับผู้เดินทางทางน้ำ','This river pier west of the Grand Palace is a practical arrival point for the historic royal quarter. Boat operators and stopping patterns vary.','大象码头位于大皇宫西面的湄南河岸，是从水路进入曼谷王宫老城区的重要节点。'),
    see:l('อ่านป้ายท่าและชื่อเรือ สังเกตระดับน้ำและสะพานขึ้นลงเรือโดยไม่กีดขวางผู้โดยสาร','Read the pier and boat route boards and notice the working riverfront; keep boarding ramps clear.','观察码头航线牌、河岸活动与浮码头设施，不要阻挡乘客登船。'),
    visit:l('ถามพนักงานถึงปลายทางและค่าโดยสารก่อนขึ้น เรือบางสายไม่จอดทุกท่า','Confirm the operator, destination, fare and actual stop before boarding; not every service calls at every pier.','上船前核对运营商、票价和目的地；并非所有湄南河航线都停靠该码头。'),
  },
  'grand-palace': {
    name:l('พระบรมมหาราชวัง','The Grand Palace','曼谷大皇宫'),
    about:l('พระบรมมหาราชวังสร้างขึ้นตั้งแต่การสถาปนากรุงเทพฯ พ.ศ. 2325 เป็นกลุ่มอาคารพระราชพิธีที่อยู่ทางใต้ของสนามหลวง','Founded in 1782 with Bangkok’s establishment as the capital, the Grand Palace is an extensive royal and ceremonial complex south of Sanam Luang.','大皇宫始建于1782年曼谷建都之际，位于皇家田广场南侧，保存了具有皇家仪式意义的建筑群。'),
    see:l('มองแนวกำแพง ประตู หลังคาเครื่องยอด และความต่างของสถาปัตยกรรมแต่ละอาคาร','Compare walls, decorated rooflines, gates and the differing architectural styles within the compound.','注意宫墙、入口、层叠屋顶与不同宫殿建筑样式；广场外观赏与购票入内是两种行程。'),
    visit:l('ตรวจวันพระราชพิธี เวลาเปิด และการแต่งกายจากเว็บไซต์ทางการก่อนเข้าเยี่ยมชม','Check ceremonial closures, visitor entry and the strict dress code on the official palace website before buying tickets.','入内须遵守着装及安检要求，开放时间会因皇家活动变化；请查看王宫官方公告。'),
  },
  'wat-phra-kaew': {
    name:l('วัดพระศรีรัตนศาสดาราม','Wat Phra Kaew','玉佛寺'),
    about:l('วัดพระแก้วอยู่ภายในเขตพระบรมมหาราชวัง เป็นศาสนสถานสำคัญที่ประดิษฐานพระแก้วมรกต','The Temple of the Emerald Buddha sits within the Grand Palace precinct and is among Thailand’s most important royal religious sites.','玉佛寺位于大皇宫建筑群内，供奉玉佛，是泰国最重要的皇家佛教场所之一。'),
    see:l('ชมพระเจดีย์สีทอง ระเบียงภาพจิตรกรรม และงานประดับกระจกตามอาคาร','Study the gold chedi, gallery murals and intricate mirrored decoration across the temple buildings.','重点欣赏金色佛塔、回廊壁画、屋顶和镜面镶嵌装饰。'),
    visit:l('ใช้ทางเข้าผู้เยี่ยมชมของพระบรมมหาราชวัง และงดถ่ายภาพในบริเวณที่มีป้ายห้าม','Follow the Grand Palace visitor entrance and respect restrictions on photography inside sacred interiors.','按大皇宫游客入口进入，遵守衣着要求及殿内禁拍规定。'),
  },
  'bangkok-national-museum': {
    name:l('พิพิธภัณฑสถานแห่งชาติ พระนคร','Bangkok National Museum','曼谷国家博物馆'),
    about:l('พิพิธภัณฑ์ตั้งอยู่ในเขตวังหน้าเดิมทางตะวันตกของสนามหลวง จัดแสดงประวัติศาสตร์ โบราณคดี และศิลปกรรมไทย','The museum occupies part of the former Front Palace west of Sanam Luang, with collections covering Thai archaeology, royal history and art.','国家博物馆坐落在皇家田广场西侧的旧前宫区域，展示泰国考古、王室历史和艺术藏品。'),
    see:l('สังเกตทั้งอาคารวังเก่าและรูปแบบการจัดแสดง เลือกห้องประวัติศาสตร์หรือศิลปกรรมตามเวลา','Notice the former palace architecture as well as objects in the galleries; choose a few rooms rather than rushing the whole collection.','除了展品，也值得观察前宫历史建筑、展厅布局以及传统艺术细部。'),
    visit:l('ตรวจวันเปิดห้องจัดแสดงและนิทรรศการพิเศษกับกรมศิลปากร เตรียมเวลาอ่านคำอธิบาย','Check the Fine Arts Department’s current museum schedule and exhibition access; allow time to read labels.','请核对泰国艺术厅公布的开放日与展厅安排，最好预留较充分的室内参观时间。'),
  },
  'bangkok-city-pillar': {
    name:l('ศาลหลักเมืองกรุงเทพมหานคร','Bangkok City Pillar Shrine','曼谷城市之柱神庙'),
    about:l('ศาลหลักเมืองเกี่ยวเนื่องกับการสถาปนากรุงเทพฯ สมัยรัชกาลที่ 1 ตั้งอยู่ด้านตะวันออกของพระบรมมหาราชวัง','Associated with Bangkok’s founding under Rama I, the City Pillar Shrine stands east of the Grand Palace and remains an active place of worship.','城市之柱神庙与拉玛一世时期的曼谷建城仪式相关，位于大皇宫东面，至今仍有民众前来参拜。'),
    see:l('สังเกตหลังคาศาลและลำดับพื้นที่สักการะ พร้อมเคารพผู้ที่มาประกอบพิธี','Notice the shrine roofs and devotional spaces without blocking people offering prayers.','观察庙宇屋顶和参拜空间组织，不妨碍正在进行的宗教活动。'),
    visit:l('แต่งกายสุภาพ พูดเบา ๆ และปฏิบัติตามป้ายของศาลในวันที่มีพิธี','Dress respectfully and follow local signs; ceremonies can affect which spaces are accessible.','穿着得体并保持安静，遇到仪式活动按现场指示游览。'),
  },
  'wat-pho': {
    name:l('วัดพระเชตุพนวิมลมังคลาราม','Wat Pho','卧佛寺'),
    about:l('วัดโพธิ์อยู่ทางใต้ของพระบรมมหาราชวัง มีพระพุทธไสยาสน์องค์ใหญ่ กลุ่มเจดีย์ และประเพณีการเรียนรู้ของวัด','South of the Grand Palace, Wat Pho is celebrated for the Reclining Buddha, its chedi courtyards and historical role in preserving traditional learning.','卧佛寺位于大皇宫南侧，以巨型卧佛、佛塔院落和传统知识碑铭著称。'),
    see:l('ชมพระนอนในอาคารและลานพระเจดีย์ต่างหาก สังเกตลวดลายและจารึกตามทางเดิน','See the Reclining Buddha and separate chedi courtyards; look closely at mosaic details and historical inscriptions.','分别欣赏卧佛殿与佛塔群，留意彩瓷镶饰及知识碑铭。'),
    visit:l('วัดมีการจำหน่ายบัตรแยกจากพระบรมมหาราชวัง ต้องตรวจเวลาเปิดและการแต่งกาย','Wat Pho has its own admission arrangements, separate from the Grand Palace; check hours and dress requirements.','卧佛寺独立售票，开放时间与着装规定应以寺院发布的信息为准。'),
  },
  'thammasat-university': {
    name:l('มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์','Thammasat University Tha Phra Chan','法政大学塔帕占校区'),
    about:l('มหาวิทยาลัยริมเจ้าพระยาฝั่งท่าพระจันทร์เชื่อมโยงกับประวัติศาสตร์การศึกษาและการเมืองสมัยใหม่ของไทย','This riverside university campus is closely connected to Thailand’s modern higher-education and civic history.','法政大学塔帕占校区位于湄南河旁，与泰国近现代高等教育和公共历史密切相关。'),
    see:l('ชมแนวอาคารสถาบันกับถนนย่านท่าพระจันทร์จากทางสาธารณะ และเคารพพื้นที่เรียนการสอน','Observe institutional buildings and their relationship to the river from public approaches; this remains a working campus.','从开放街道观察校园建筑与河岸关系，注意它仍然是教学科研场所。'),
    visit:l('ตรวจทางเข้าอาคารก่อนเดินเข้า ไม่รบกวนการเรียนและพื้นที่จำกัดการเข้าถึง','Check access restrictions before entering grounds or buildings, and avoid disrupting classes.','只进入允许公众到访的区域，勿影响课堂和校内活动。'),
  },
  'democracy-monument': {
    name:l('อนุสาวรีย์ประชาธิปไตย','Democracy Monument','民主纪念碑'),
    about:l('อนุสาวรีย์บนถนนราชดำเนินกลางสร้างขึ้นเพื่อรำลึกการเปลี่ยนแปลงการปกครอง พ.ศ. 2475','On Ratchadamnoen Klang Avenue, the monument commemorates Thailand’s 1932 political change and forms a key axis of modern Bangkok.','民主纪念碑位于拉差丹嫩中央大道，纪念1932年泰国政治体制变革，是曼谷近现代城市轴线的一部分。'),
    see:l('สังเกตรูปทรงสี่ด้านและความสัมพันธ์กับถนนราชดำเนินจากทางเท้าที่ปลอดภัย','Study the monument’s four-part composition and its relationship to the avenue from safe sidewalks.','从周边人行道观察四面建筑构图与大道轴线，避免进入交通环岛。'),
    visit:l('อนุสาวรีย์ตั้งกลางวงเวียนรถหนาแน่น ห้ามเดินฝ่าถนนเพื่อเข้าไปถ่ายภาพ','It stands in a busy traffic circle: never enter the roadway or central island for a photograph.','此地车流繁忙，切勿为拍照横穿车道或进入环岛中心。'),
  },
  'tha-maharaj': {
    name:l('ท่ามหาราช','Tha Maharaj','Tha Maharaj 河岸商区'),
    about:l('ย่านร้านค้าและอาหารริมน้ำเจ้าพระยาใกล้ถนนมหาราช เป็นจุดพักหลังเที่ยวพระบรมมหาราชวังหรือสนามหลวง','Tha Maharaj is a riverside dining and retail complex near Maharaj Road, suitable for a break after the royal quarter.','Tha Maharaj 是 Maharaj Road 附近的河岸餐饮与商业区，适合在王宫区游览后用餐休息。'),
    see:l('เดินชมพื้นที่ริมน้ำ มองกิจกรรมเรือ และเลือกจุดพักที่ไม่กีดขวางทางสัญจร','Look toward the Chao Phraya and river traffic from public terraces while allowing pedestrian circulation.','在公共露台欣赏湄南河与船只活动，留意出入口及河岸步行空间。'),
    visit:l('ตรวจเวลาร้านค้าและบริการเรือแยกกัน และอย่าสับสนกับชื่อท่าเรืออื่นใกล้เคียง','Shop and restaurant hours differ from pier services. Check the exact location rather than confusing it with neighboring piers.','餐饮店营业时间与码头服务时间不同，导航时核对 Tha Maharaj 的地点名称。'),
  },
  'riverfront-dining': {
    name:l('อาหารและทางเดินริมแม่น้ำเจ้าพระยา','Chao Phraya Riverside Dining Walk','湄南河沿岸餐饮散步'),
    about:l('คู่มือเลือกย่านอาหารริมแม่น้ำหลังเที่ยวสนามหลวง ไม่ใช่ชื่อสถานประกอบการหรือท่าเรือแห่งเดียว','This is an area guide for choosing an evening riverfront meal after Sanam Luang, not a single named market or venue.','这是一篇皇家田广场游览后的河岸晚餐区域攻略，并非某一处名为“河岸夜市”的固定景点。'),
    see:l('พิจารณาว่าร้านอยู่ฝั่งพระนครหรือธนบุรีและต้องข้ามเรือหรือไม่ จากนั้นเลือกเส้นทางกลับที่ปลอดภัย','Compare Phra Nakhon and Thonburi-bank options, river views, ferry crossings and your route home.','先分清餐厅位于曼谷老城岸还是吞武里岸，确定是否需要渡船，以及晚间返程方式。'),
    visit:l('ตรวจเวลาเปิดร้าน ท่าเรือ และบริการรถก่อนออกเดินทาง ไม่ควรสมมติว่าทุกร้านเปิดดึก','Verify individual restaurant hours and final boat or transit services; not all riverfront venues open late.','晚餐前检查具体商户、渡口和公共交通的当日运营情况，不宜假设所有商户营业至深夜。'),
  },
} as const;

export type RouteDestinationSlug = keyof typeof routeDestinations;
export const routeDestinationSlugs = Object.keys(routeDestinations) as RouteDestinationSlug[];
export const generalRouteLinks:Record<number,RouteDestinationSlug[][]> = {
  0: [ ['sanam-chai-mrt','tha-chang-pier'], [], ['grand-palace','wat-phra-kaew'], ['bangkok-national-museum','bangkok-city-pillar'], [] ],
  1: [ [], ['grand-palace','wat-phra-kaew','wat-pho'], [], ['bangkok-national-museum','bangkok-city-pillar','thammasat-university'], ['democracy-monument'], ['tha-maharaj','riverfront-dining'] ],
};
