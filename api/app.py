import sys 
sys.path.append("/Users/shuge/Library/Python/3.8/lib/python/site-packages/Conan/")
from flask import *
import pandas as pd
from Conan.src.model import MultiDimContrastPatternMiner 
from Conan.src.search.scoring_func import count_agg_func, diff_score, ratio_diff_score, lift_score 


UPLOAD_FOLDER = r'./uploads'

ALLOWED_EXTENSIONS = set(['png'])
app = Flask(__name__)


# 添加header解决跨域
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, X-Requested-With'
    return response


@app.route('/')
@app.route('/conan')
@app.route('/spine')
def index():
  return render_template('index.html')


@app.route('/conan/file', methods=["POST"])
def conan_file():
    
    file = request.files['file']
    iterationSteps = int(request.form['iterationSteps'])
    patternNumber = int(request.form['patternNumber'])
    patternLength = int(request.form['patternLength'])
    data = pd.read_csv(file)

    data.columns = data.columns.map(lambda x:x.lower())

    instance_identifier_col = "requestid"
    attribute_cols = []

    # check if all mandatory cols provided
    CLASS_COL = "label"
    WEIGHT_COL = "weight"
    
    MANDATORY_COLS = [instance_identifier_col, CLASS_COL, WEIGHT_COL]
    dic = dict(zip(MANDATORY_COLS,[0]*len(MANDATORY_COLS)))
    for column in data:
        column = column.lower()
        if column in dic:
            dic[column] = 1
        else:
            attribute_cols.append(column)
    isValid = 1
    for v in dic.values():
        isValid &= v
    if not isValid:
        return abort(400, {'message': 'id, label and weight all required'})

    # pass into CONAN
    model = MultiDimContrastPatternMiner(data, instance_identifier_col, attribute_cols, CLASS_COL, WEIGHT_COL, search_algo="MetaSearch") 
    model.build_core_data_model() 
    results = model.run_search(scoring_func=ratio_diff_score, agg_func=count_agg_func, max_step=iterationSteps, max_vain_step=20, max_pattern_num=patternNumber, max_pattern_len=patternLength) 
    
    results = model.post_processing(results) 

    r = []
    for index, row in results.iterrows():
        temp = {}
        for col in results.columns:
            temp[col] = row[col]
        temp = {
            'score': temp['score'],
            'diagnosis_results': dict(temp['pattern']),
        }
        r.append(temp)

    return jsonify({'data':r})

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8080)
