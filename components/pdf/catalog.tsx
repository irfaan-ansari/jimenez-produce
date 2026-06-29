import { styles } from "./styles";
import { formatUSD } from "@/lib/utils";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

const colors = {
  background: "#13360c",
  border: "#d9f99d",
  text: "#ffffff",
};

export const CatalogPDF = ({ data }: { data: any }) => {
  console.log(data);
  return (
    <Document>
      <Page
        size="A4"
        style={[
          styles.page,
          {
            backgroundColor: colors.background,
            paddingVertical: 12,
            paddingHorizontal: 12,
          },
        ]}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            {
              borderBottom: 0,
              paddingBottom: 0,
              justifyContent: "space-between",
              marginBottom: 12,
            },
          ]}
        >
          <View style={{ ...styles.headerLeft, gap: 12 }}>
            <View
              style={{
                borderWidth: 2,
                borderColor: colors.border,
                backgroundColor: "#f7fee7",
                width: 60,
                height: 60,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={process.env.BETTER_AUTH_URL + "/logo.png"}
                style={{ ...styles.logo, width: 50 }}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.docTitle,
                  {
                    color: "#fff",
                    marginBottom: 18,
                    textTransform: "uppercase",
                  },
                ]}
              >
                Jimenez Produce
              </Text>
              <Text
                style={[
                  styles.label,
                  {
                    color: "#fff",
                    fontSize: 9,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  },
                ]}
              >
                Weekly Price List • Food Service Distribution
              </Text>
              <Text style={[styles.label, { color: colors.border }]}>
                Lafayette
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  ...styles.label,
                  color: "#d9f99d",
                  textAlign: "left",
                  marginRight: 4,
                }}
              >
                Week of &nbsp;•
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "right",
                  color: "#fff",
                }}
              >
                June 29 - July 6, 2026
              </Text>
            </View>
            <Text
              style={{ ...styles.label, color: "#fff", textTransform: "none" }}
            >
              Office: (337) 896-0060
            </Text>
            <Text
              style={{ ...styles.label, color: "#fff", textTransform: "none" }}
            >
              Admin: (337) 840-1440
            </Text>
            <Text
              style={{ ...styles.label, color: "#fff", textTransform: "none" }}
            >
              Sales: (769) 684-8857
            </Text>
          </View>
        </View>

        {/* FEATURED */}
        <View
          style={{
            gap: 12,
            flexDirection: "row",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                borderWidth: 2,
                borderColor: colors.border,
                backgroundColor: "#f7fee7",
                borderRadius: 12,
                padding: 8,
              }}
            >
              <Image
                src={process.env.BETTER_AUTH_URL + "/logo.png"}
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: "center",
                  marginBottom: 4,
                }}
              />
              <Text style={[styles.label, { fontSize: 8 }]}>
                Chicken Breast Jumbo
              </Text>
              <Text
                style={[
                  styles.tagline,
                  { color: colors.background, fontWeight: "bold" },
                ]}
              >
                {formatUSD(12)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ gap: 12, marginTop: 12, flex: 1 }}>
          {/* DYNAMIC CATEGORY BLOCKS LOOP */}
          {Object.entries(data.products).map(
            ([category, products]: [string, any], i) => (
              <View
                key={category}
                wrap={false}
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 2,
                  borderColor: "#052e16",
                  borderRadius: 12,
                  overflow: "hidden",
                  flexGrow: 1,
                }}
              >
                {/* 1. Category Header Banner (Colored top segment) */}
                <View
                  style={{
                    backgroundColor: colors.border,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <Text
                    style={[
                      styles.tagline,
                      {
                        color: "#000",
                        lineHeight: 1,
                        padding: 12,
                      },
                    ]}
                  >
                    {category}
                  </Text>
                </View>

                {/* 2. White Grid Container for Products */}
                <View
                  style={{
                    padding: 8,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {products?.map((product: any) => (
                    <View
                      key={product.id}
                      style={{
                        width: "48.5%", // Clean 2-column distribution side-by-side
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        paddingVertical: 4,
                        paddingHorizontal: 2,
                        borderBottomWidth: 1,
                        borderBottomColor: "#f2f5f3",
                      }}
                    >
                      {/* Left Product Title Section */}
                      <View style={{ flex: 1, paddingRight: 6 }}>
                        <Text
                          style={[
                            styles.label,
                            {
                              color: "#052e16",
                              fontSize: 8,
                              flexWrap: "wrap",
                              textTransform: "none",
                              lineHeight: 1.25,
                            },
                          ]}
                        >
                          {product.title}
                        </Text>
                      </View>

                      {/* Right Product Price Section */}
                      <View style={{ flexShrink: 0 }}>
                        <Text
                          style={[
                            styles.tagline,
                            {
                              color: "#052e16",
                              fontWeight: "bold",
                              fontSize: 8,
                            },
                          ]}
                        >
                          {formatUSD(product.basePrice)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ),
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 16,
            backgroundColor: "#f7fee7",
            marginLeft: -12,
            marginRight: -12,
            marginBottom: -12,
            marginTop: 12,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              borderRightWidth: 1,
              borderColor: colors.border,
              flex: 1,
              gap: 8,
            }}
          >
            <Image
              src={process.env.BETTER_AUTH_URL + "/icons/leaf.png"}
              style={{ width: 28, height: 28 }}
            />
            <View>
              <Text style={{ ...styles.label, color: colors.background }}>
                Fresh Quanlity
              </Text>
              <Text>Hand selected produce</Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              borderRightWidth: 1,
              borderColor: colors.border,
              flex: 1,
              gap: 8,
            }}
          >
            <Image
              src={process.env.BETTER_AUTH_URL + "/icons/price.png"}
              style={{ width: 28, height: 28 }}
            />
            <View>
              <Text style={{ ...styles.label, color: colors.background }}>
                Great Prices
              </Text>
              <Text>Competitive prices every week</Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              flex: 1,
              gap: 8,
            }}
          >
            <Image
              src={process.env.BETTER_AUTH_URL + "/icons/truck.png"}
              style={{ width: 28, height: 28 }}
            />
            <View>
              <Text style={{ ...styles.label, color: colors.background }}>
                Reliable Delivery
              </Text>
              <Text>On time delivery you can count on</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
